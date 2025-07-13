const UserList = ({ users, typingUsers }) => {
  return (
    <div className="w-48 bg-gray-200 p-2">
      <h2 className="font-bold">Users</h2>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.username}{" "}
            {typingUsers.includes(u.username) && (
              <span className="text-xs text-green-500">(typing...)</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
