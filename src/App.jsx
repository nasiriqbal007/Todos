import React, { useEffect, useState } from "react";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isCompleted: false,
  });
  const [edit, setEdit] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) return;

    if (edit) {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === edit.id ? { ...todo, ...formData } : todo
        )
      );
      setEdit(null);
    } else {
      setTodos((prev) => [
        ...prev,
        { ...formData, id: Date.now(), isCompleted: false },
      ]);
    }
    setFormData({ title: "", description: "", isCompleted: false });
  };

  const handleEdit = (id) => {
    const selected = todos.find((todo) => todo.id === id);
    if (!selected) return;
    setFormData(selected);
    setEdit(selected);
  };

  const handleDelete = (id) =>
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  const handleComplete = (id) =>
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-amber-50 p-8">
      <div className="form-container">
        <h1 className="page-heading">{edit ? "Edit Todo" : "Add New Todo"}</h1>
        <form onSubmit={handleSubmit} className="form-group">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter Todo Title"
            className="input-field"
            required
          />
          <input
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter Todo Description"
            className="input-field"
            required
          />
          <button className="btn btn-amber">
            {edit ? "Update Todo" : "Add Todo"}
          </button>
        </form>
      </div>

      <div className="todo-list">
        {todos.length === 0 ? (
          <p className="empty-state">
            No todos yet. Add something, you productive legend.
          </p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`todo-card ${
                todo.isCompleted ? "todo-completed-card" : ""
              }`}
            >
              <div className="todo-header">
                <input
                  type="checkbox"
                  checked={todo.isCompleted}
                  onChange={() => handleComplete(todo.id)}
                  className="todo-checkbox"
                />
                <div className="todo-content">
                  <h3
                    className={todo.isCompleted ? "todo-title-completed" : ""}
                  >
                    {todo.title}
                  </h3>
                  <p
                    className={
                      todo.isCompleted ? "todo-description-completed" : ""
                    }
                  >
                    {todo.description}
                  </p>
                </div>
              </div>
              <div className="btn-group">
                <button
                  onClick={() => handleEdit(todo.id)}
                  disabled={todo.isCompleted}
                  className={`btn btn-amber btn-sm ${
                    todo.isCompleted ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="btn btn-red btn-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
