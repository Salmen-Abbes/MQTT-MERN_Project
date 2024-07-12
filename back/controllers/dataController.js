let data = [];

const getData = (req, res) => {
  res.send(data);
};

const addData = (jsonData) => {
  data.push(jsonData);
};

module.exports = {
  getData,
  addData
};
