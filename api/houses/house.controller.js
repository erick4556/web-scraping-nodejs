const House = require("./houses.model");

const getData = async (queryString) => {
  const { stars, services, confort, numConforts } = queryString;

  const query = {};

  if (stars) {
    query.stars = Number(stars);
  }

  if (services) {
    const s = services.split(",");
    query.services = { $all: s }; //Tiene que haber match en todos los elementos del objeto
  }

  if (confort && numConforts) {
    query[`conforts.${confort}`] = Number(numConforts);
  }

  const result = await House.find(query);
  return result;
};

module.exports = {
  getData,
};
