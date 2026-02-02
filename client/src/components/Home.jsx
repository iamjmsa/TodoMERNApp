import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
// Calandar Module
import TodoCalendar from "../includes/TodoCalendar";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  useEffect(() => {
    axios
      .get("http://localhost:3000/auth", { withCredentials: true })
      .then((response) => {
        if (response.data.success) {
          setUser(response.data.user);
        }
      })
      .catch(() => setUser(""));
  }, []);

  const handleLogout = () => {
    axios
      .post("http://localhost:3000/logout", {}, { withCredentials: true })
      .then((response) => {
        if (response.data.success) {
          navigate(response.data.redirect);
        }
      })
      .catch((error) => {
        console.log(error.reponse.data.message);
      });
  };

  useEffect(() => {
    fetchAllTask();
    fetchAllCompletedTask();
    fetchAllTaskCalendar();
  }, []);

  const [fetchTask, setFetchTask] = useState([]);

  const fetchAllTask = () => {
    axios
      .get("http://localhost:3000/allTask", { withCredentials: true })
      .then((response) => {
        if (response.data.success) {
          setFetchTask(response.data.task);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [showAddTask, setShowAddTask] = useState(false);
  const handleOpenModalAddTask = () => setShowAddTask(true);
  const handleCloseModalAddTask = () => {
    setShowAddTask(false);
    setAddTaskError({});
  };

  const [task, setTask] = useState("");
  const [due, setDue] = useState(() => {
    return new Date().toISOString().split("T")[0] + "T23:59";
  });
  const [importance, setImportance] = useState("");
  const [error, setAddTaskError] = useState({});

  const handleSubmitAddTask = (event) => {
    setAddTaskError({});
    event.preventDefault();

    axios
      .post(
        "http://localhost:3000/task",
        { userId: user.id, task, due, importance },
        { withCredentials: true }
      )
      .then((response) => {
        if (response.data.success) {
          handleCloseModalAddTask();
          fetchAllTask();
          fetchAllTaskCalendar();
        }
      })
      .catch((error) => {
        if (!error.response.data.success) {
          const addTaskError = {};
          error.response.data.message.forEach((err) => {
            addTaskError[err.path] = err.msg;
          });
          setAddTaskError(addTaskError);
        }
      });
  };

  const handleSubmitDoneTask = (id) => {
    axios
      .post("http://localhost:3000/done", { id }, { withCredentials: true })
      .then((response) => {
        if (response.data.success) {
          fetchAllTask();
          fetchAllCompletedTask();
          fetchAllTaskCalendar();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [showEditTask, setShowEditTask] = useState(false);
  const handleOpenModalEditTask = () => setShowEditTask(true);
  const handleCloseModalEditTask = () => {
    setShowEditTask(false);
    setEditTaskError({});
  };

  const [editTaskId, setEditTaskId] = useState("");
  const [editTask, setEditTask] = useState("");
  const [editDue, setEditDue] = useState("");
  const [editImportance, setEditImportance] = useState("");
  const [errors, setEditTaskError] = useState({});

  const handleFetchEditTask = (id) => {
    handleOpenModalEditTask();
    axios
      .get(`http://localhost:3000/editTask/${id}`, { withCredentials: true })
      .then((response) => {
        if (response.data.success) {
          setEditTaskId(response.data.task._id);
          setEditTask(response.data.task.task);
          setEditDue(response.data.task.due);
          setEditImportance(response.data.task.importance);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmitUpdateTask = (event) => {
    setEditTaskError({});
    event.preventDefault();
    axios
      .put(
        "http://localhost:3000/updateTask",
        {
          id: editTaskId,
          task: editTask,
          due: editDue,
          importance: editImportance,
        },
        { withCredentials: true }
      )
      .then((response) => {
        handleCloseModalEditTask();
        fetchAllTask();
        fetchAllTaskCalendar();
      })
      .catch((error) => {
        if (!error.response.data.success) {
          const editTaskError = {};

          error.response.data.message.forEach((err) => {
            editTaskError[err.path] = err.msg;
          });

          setEditTaskError(editTaskError);
        }
      });
  };

  const [removeTaskId, setRemoveTaskId] = useState(null);
  const [showRemoveTask, setShowRemoveTask] = useState(false);
  const handleOpenModalRemoveTask = () => setShowRemoveTask(true);
  const handleCloseModalRemoveTask = () => setShowRemoveTask(false);

  const handleSubmitDeleteTaskId = () => {
    axios
      .delete(
        "http://localhost:3000/deleteTask",
        { data: { removeTaskId } },
        { withCredentials: true }
      )
      .then((response) => {
        if (response.data.success) {
          handleCloseModalRemoveTask();
          fetchAllTask();
          fetchAllCompletedTask();
          fetchAllTaskCalendar();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [completed, setAllCompletedTask] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [completedTask, setCompletedTask] = useState([]);
  const fetchAllCompletedTask = () => {
    axios
      .get("http://localhost:3000/completed", { withCredentials: true })
      .then((response) => {
        const fetchTaskCompleted = response.data.completed || [];
        setAllCompletedTask(fetchTaskCompleted);

        setCompletedTask(fetchTaskCompleted.slice(0, 5));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (completed.length === 0) return;

    if (showAll) {
      setCompletedTask([...completed]); // show all
    } else {
      setCompletedTask(completed.slice(0, 5)); // show 8
    }
  }, [showAll, completed]);

  const [calendar, setCalendar] = useState([]);
  const fetchAllTaskCalendar = () => {
    axios
      .get("http://localhost:3000/calendar", { withCredentials: true })
      .then((response) => {
        setCalendar(response.data.calendar);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <nav
        className="navbar top-bar navbar-expand shadow sticky-top"
        style={{ backgroundColor: "#2b58cc" }}
      >
        <div className="container-fluid px-4">
          <a className="navbar-brand fw-bold fs-5 text-light" href="#">
            <i className="bi bi-check2-square me-2"></i>ToDo MERN App
          </a>
          <div className="ms-auto d-flex align-items-center gap-3">
            {/* <button className="btn btn-sm">
              <i className="bi bi-search  text-light"></i>
            </button>
            <button className="btn btn-sm position-relative">
              <i className="bi bi-bell  text-light"></i>
              <span className="position-absolute top-0 start-100 translate-middle badge bg-danger rounded-pill">
                2
              </span>
            </button> */}
            <div className="dropdown">
              <a
                className="d-flex align-items-center text-decoration-none dropdown-toggle text-light"
                href="#"
                data-bs-toggle="dropdown"
              >
                <img
                  src={`https://ui-avatars.com/api/?name=${user?.fullname}&background=fff&color=1c1c1c`}
                  alt="avatar"
                  className="rounded-circle me-2"
                  width="36"
                  height="36"
                />
                <span>{`${user?.fullname}`}</span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <a className="dropdown-item" href="#">
                    Profile
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                    href="#"
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
      <div className="container my-4">
        <div className="text-center mb-5">
          <h2 className="fw-bold welcome">Welcome Back!</h2>
          <p className="text-muted lead">Manage your tasks efficiently</p>
        </div>
        <div className="row justify-content-center mb-5">
          <div className="col-lg-9">
            <div className="input-group input-group-lg shadow">
              <input
                type="text"
                className="form-control"
                placeholder="Add a new task..."
                onClick={() => handleOpenModalAddTask()}
                readOnly
              />
              {/* <button className="btn btn-primary px-5">Add Task</button> */}
            </div>
          </div>
        </div>
        {/* Add Task Modal */}
        <Modal
          show={showAddTask}
          onHide={handleCloseModalAddTask}
          backdrop="static"
          keyboard="false"
        >
          <Modal.Header closeButton>
            <Modal.Title>Adding Task</Modal.Title>
          </Modal.Header>
          <form method="post" onSubmit={handleSubmitAddTask}>
            <Modal.Body>
              <div className="mb-3">
                <label htmlFor="task" className="fw-bold">
                  Task
                </label>
                <input
                  type="text"
                  name="task"
                  className={`form-control ${error.task ? "is-invalid" : ""}`}
                  placeholder="New Task"
                  onChange={(e) => setTask(e.target.value)}
                />
                {error.task && (
                  <small className="text-danger">{error.task}</small>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="due" className="fw-bold">
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  name="due"
                  className={`form-control ${error.due ? "is-invalid" : ""}`}
                  value={due}
                  onChange={(e) => setDue(e.target.value)}
                />
                {error.due && (
                  <small className="text-danger">{error.due}</small>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="importance" className="fw-bold">
                  Importance
                </label>
                <select
                  name="importance"
                  className={`form-control ${
                    error.importance ? "is-invalid" : ""
                  }`}
                  onChange={(e) => setImportance(e.target.value)}
                >
                  <option value="">Type of Importance</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                {error.importance && (
                  <small className="text-danger">{error.importance}</small>
                )}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModalAddTask}
              >
                Close
              </Button>
              <Button type="submit" className="btn btn-primary">
                Save
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
        {/* End - Add Task Modal */}

        {/* Pending Accordion UI */}
        <div className="row g-4">
          <div className="col-lg-5 col-12">
            <div className="row g-4">
              <div className="col-12">
                <div className="accordion shadow">
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button text-white fw-semibold"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#pendingTasksCollapse"
                        aria-expanded="true"
                        style={{ backgroundColor: "#1055C9" }}
                      >
                        Pending Tasks
                        <span className="badge bg-light text-primary ms-2">
                          {fetchTask.length}
                        </span>
                      </button>
                    </h2>

                    <div
                      id="pendingTasksCollapse"
                      className="accordion-collapse collapse show"
                    >
                      <div className="accordion-body p-0">
                        <ul className="list-group list-group-flush">
                          {fetchTask.length === 0 ? (
                            <div className="d-flex justify-content-center">
                              <p className="fw-semibold mt-2">No Result.</p>
                            </div>
                          ) : (
                            fetchTask.map((data) => (
                              <li
                                className="list-group-item task-item d-flex justify-content-between align-items-center py-3 px-3"
                                key={data._id}
                              >
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    onClick={() =>
                                      handleSubmitDoneTask(data._id)
                                    }
                                  />
                                  <label className="form-check-label ms-2 fw-medium">
                                    {data.task}
                                  </label>
                                </div>
                                <div className="d-flex align-items-center gap-3 text-muted">
                                  <span className="fw-semibold">
                                    {new Date(data.due).toLocaleDateString(
                                      "en-US",
                                      {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      }
                                    )}
                                  </span>
                                  <i
                                    className="bi bi-pencil-square"
                                    onClick={() => {
                                      handleFetchEditTask(data._id);
                                      // setEditTaskId(data._id);
                                    }}
                                  ></i>
                                  <i
                                    className="bi bi-trash3-fill text-danger"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      setRemoveTaskId(data._id);
                                      handleOpenModalRemoveTask();
                                    }}
                                  ></i>
                                </div>
                              </li>
                            ))
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End - Pending */}
              </div>
              <div className="col-12 mt-4">
                <div className="accordion shadow">
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button text-white fw-semibold collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#completedTasksCollapse"
                        aria-expanded="false"
                        style={{ backgroundColor: "#41A67E" }}
                      >
                        Completed Tasks
                        {/* <span className="badge bg-light text-primary ms-2">4</span> */}
                      </button>
                    </h2>

                    <div
                      id="completedTasksCollapse"
                      className="accordion-collapse collapse"
                    >
                      <div className="accordion-body p-0">
                        <ul className="list-group list-group-flush">
                          {completedTask.length === 0 ? (
                            <p className="fw-semibold">No Result</p>
                          ) : (
                            completedTask.map((data) => (
                              <li
                                className="list-group-item d-flex justify-content-between "
                                key={data._id}
                              >
                                <span className="text-decoration-line-through text-muted">
                                  {data.task}
                                </span>
                                <div className="d-flex align-items-center gap-3 text-muted">
                                  <div className="text-muted">
                                    {new Date(data.due).toLocaleDateString(
                                      "en-US",
                                      {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      }
                                    )}
                                  </div>
                                  <div className="d-flex align-items-center gap-3">
                                    <i
                                      className="bi bi-trash3-fill text-danger"
                                      style={{ cursor: "pointer" }}
                                      onClick={() => {
                                        setRemoveTaskId(data._id);
                                        handleOpenModalRemoveTask();
                                      }}
                                    ></i>
                                  </div>
                                </div>
                              </li>
                            ))
                          )}
                          {/* <button className="btn btn-primary">Show More</button> */}
                          {completed.length > 8 && (
                            <button
                              className="btn btn-link text-dark"
                              onClick={() => setShowAll(!showAll)}
                            >
                              {showAll
                                ? "Show Less"
                                : `Show All (${completed.length})`}
                            </button>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Task - Modal */}
          <Modal show={showEditTask} onHide={handleCloseModalEditTask}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Task</Modal.Title>
            </Modal.Header>
            <form method="post" onSubmit={handleSubmitUpdateTask}>
              <Modal.Body>
                <div className="mb-3">
                  <label htmlFor="task" className="fw-bold">
                    Task
                  </label>
                  <input
                    type="text"
                    name="task"
                    className={`form-control ${
                      errors.task ? "is-invalid" : ""
                    }`}
                    placeholder="New Task"
                    value={editTask}
                    onChange={(e) => setEditTask(e.target.value)}
                  />
                  {errors.task && (
                    <small className="text-danger">{errors.task}</small>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="due" className="fw-bold">
                    Due Date
                  </label>
                  <input
                    type="datetime-local"
                    name="due"
                    className={`form-control ${errors.due ? "is-invalid" : ""}`}
                    value={editDue}
                    onChange={(e) => setEditDue(e.target.value)}
                  />
                  {errors.due && (
                    <small className="text-danger">{errors.due}</small>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="importance" className="fw-bold">
                    Importance
                  </label>
                  <select
                    name="importance"
                    className={`form-control ${
                      errors.importance ? "is-invalid" : ""
                    }`}
                    value={editImportance}
                    onChange={(e) => setEditImportance(e.target.value)}
                  >
                    <option value="">Type of Importance</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  {errors.importance && (
                    <small className="text-danger">{errors.importance}</small>
                  )}
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => handleCloseModalEditTask()}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
              </Modal.Footer>
            </form>
          </Modal>
          {/* Delete Task - Modal */}
          <Modal
            show={showRemoveTask}
            onHide={handleCloseModalRemoveTask}
            backdrop="static"
            keyboard="false"
          >
            <Modal.Header closeButton>
              <Modal.Title>Remove Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className="semi-bold">Do you want to delete this task?</p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                type="button"
                onClick={handleCloseModalRemoveTask}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmitDeleteTaskId}
                variant="danger"
              >
                Yes
              </Button>
            </Modal.Footer>
          </Modal>
          <div className="col-lg-7 col-12 card rounded">
            <TodoCalendar
              task={calendar}
              // onDateClick={handleDayClick}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
