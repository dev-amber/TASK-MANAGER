import React, { useState } from 'react';
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";

const TodoListInput = () => {
  const [option, setOption] = useState("");
  const [todoList, setTodoList] = useState([]);

  // Function to add new option to todoList
  const handleAddOption = () => {
    if (option.trim()) {
      setTodoList([...todoList, option.trim()]);
      setOption("");
    }
  };

  // Function to delete an option from todoList
  const handleDeleteOption = (index) => {
    const updatedArr = todoList.filter((_, idx) => idx !== index);
    setTodoList(updatedArr);
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-4 bg-white rounded shadow">
      {/* Render todo items */}
      {todoList.map((item, index) => {
        return (
          <div
            key={index}
            className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mt-2 mb-3"
          >
            <p className="text-xs text-black">
              <span className="text-xs text-gray-400 font-semibold mr-2">
                {index < 9 ? `0${index + 1}` : index + 1}
              </span>
              {item}
            </p>

            <button className="cursor-pointer" onClick={() => handleDeleteOption(index)}>
              <HiOutlineTrash className="text-lg text-red-500" />
            </button>
          </div>
        );
      })}

      {/* Input and add button */}
      <div className="flex items-center gap-5 mt-4">
        <input
          type="text"
          placeholder="Enter Task"
          value={option}
          onChange={(e) => setOption(e.target.value)}
          className="w-full text-[13px] text-black outline-none bg-white border border-gray-200 px-3 py-2 rounded-md"
        />

        <button className="card-btn text-nowrap flex items-center gap-1" onClick={handleAddOption}>
          <HiMiniPlus className="text-lg" /> Add
        </button>
      </div>
    </div>
  );
};

export default TodoListInput;
