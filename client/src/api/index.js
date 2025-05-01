const apiRequest = async (method, url, data, headers = {
  "Content-Type": "application/json",
}) => {
  const response = await fetch(url, { 
    method,
    body: JSON.stringify(data),
    credentials: "include",
    headers,
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export default apiRequest;
