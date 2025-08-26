import React from 'react';

const TasksPreview: React.FC = () => {
  return (
    <div className="h-full flex flex-col gap-2">
      {/* Top Stats */}
      <div className="flex gap-2">
        <div className="flex-1 bg-blue-50 rounded p-1.5">
          <div className="flex justify-between items-center">
            <div className="h-1.5 w-8 bg-gray-300 rounded"></div>
            <div className="h-3 w-3 bg-blue-400 rounded-full"></div>
          </div>
          <div className="h-2 w-6 bg-blue-500 rounded mt-1"></div>
        </div>
        <div className="flex-1 bg-orange-50 rounded p-1.5">
          <div className="flex justify-between items-center">
            <div className="h-1.5 w-8 bg-gray-300 rounded"></div>
            <div className="h-3 w-3 bg-orange-400 rounded-full"></div>
          </div>
          <div className="h-2 w-6 bg-orange-500 rounded mt-1"></div>
        </div>
        <div className="flex-1 bg-green-50 rounded p-1.5">
          <div className="flex justify-between items-center">
            <div className="h-1.5 w-8 bg-gray-300 rounded"></div>
            <div className="h-3 w-3 bg-green-400 rounded-full"></div>
          </div>
          <div className="h-2 w-6 bg-green-500 rounded mt-1"></div>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 bg-white/50 rounded-lg p-2 overflow-auto">
        <div className="space-y-1.5">
          {[
            { priority: 'high', status: 'progress' },
            { priority: 'medium', status: 'todo' },
            { priority: 'low', status: 'done' },
            { priority: 'high', status: 'todo' },
            { priority: 'medium', status: 'progress' },
            { priority: 'low', status: 'todo' }
          ].map((task, i) => (
            <div key={i} className="flex items-center gap-2 bg-gray-50 rounded p-1.5">
              {/* Checkbox */}
              <div className={`w-3 h-3 rounded border-2 ${
                task.status === 'done' ? 'bg-green-400 border-green-400' : 'border-gray-300'
              }`}></div>
              
              {/* Priority indicator */}
              <div className={`w-1 h-4 rounded ${
                task.priority === 'high' ? 'bg-red-400' :
                task.priority === 'medium' ? 'bg-orange-400' :
                'bg-blue-400'
              }`}></div>
              
              {/* Task title */}
              <div className="flex-1">
                <div className="h-1.5 w-24 bg-gray-300 rounded mb-0.5"></div>
                <div className="h-1 w-16 bg-gray-200 rounded"></div>
              </div>
              
              {/* Assignee */}
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              
              {/* Due date */}
              <div className="h-1.5 w-10 bg-gray-200 rounded"></div>
              
              {/* Status badge */}
              <div className={`h-2 w-8 rounded ${
                task.status === 'done' ? 'bg-green-200' :
                task.status === 'progress' ? 'bg-blue-200' :
                'bg-gray-200'
              }`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-1">
        <div className="flex-1 h-6 bg-green-100 rounded flex items-center justify-center">
          <div className="w-3 h-3 bg-green-400 rounded"></div>
        </div>
        <div className="flex-1 h-6 bg-blue-100 rounded flex items-center justify-center">
          <div className="w-3 h-3 bg-blue-400 rounded"></div>
        </div>
        <div className="flex-1 h-6 bg-gray-100 rounded flex items-center justify-center">
          <div className="w-3 h-3 bg-gray-400 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default TasksPreview;