export default function TokenTopup() {
  const handleClick = async () => {
    fetch('/api/addTokens', {
      method: 'POST'
    }).catch(err => console.error(err));
  }

  return (
    <div>
      <h1>This is the Token Topup page</h1>
      <button className="btn" onClick={handleClick}>Add tokens</button>
    </div>
  );
}
