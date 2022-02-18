const puppeter = require("puppeteer");
const fs = require("fs"); //Para manipular archivos
const path = require("path"); //Para manipular rutas
const { saveHouse } = require("./methods/saveData");

(async () => {
  console.log("Starting screapper...");
  const browser = await puppeter.launch({
    /* headless: false,
    slowMo: 500, */
  }); // Launch browser. headless: false -> show browser. slowMo: 500 -> slow down the browser
  const page = await browser.newPage(); // Create new page

  await page.goto("https://nextviaje.vercel.app/"); // Va al link

  const houses = [];

  const urls = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(".FilaCasas__cartas a"),
      (nodo) => nodo.href
    )
  ); // Recibe todos los links y luego una función que recibe cada nodo y retorna lo que se quiere - como si fuera un map

  for (const url of urls) {
    await page.goto(url);

    //Misma funcion que la urls que transforma una lista de nodos a un array
    const homeDetails = await page.evaluate(() => {
      const images = [
        ...document.querySelectorAll(".CasaVista__fotos img"),
      ].map((img) => img.src);
      const title = document.querySelector(".CasaVista__titulo").innerText; //Retorna solo el texto

      const location = document.querySelector(
        ".CasaVista__titulo + div"
      ).innerText;

      const price = Number(
        document
          .querySelector(".CasaVista__precio")
          .innerText.replace(/[^0-9]/g, "")
      ); //Remplaza todo lo que no sea numero por nada

      const conforts = [
        ...document.querySelectorAll(".CasaVista__cuartos span"),
      ].reduce((acc, confort) => {
        const [cantidad, nombre] = confort.innerText.split(" ");
        acc[nombre] = Number(cantidad);

        return acc; //Retorno del acumulador
      }, {});

      const services = [...document.querySelectorAll(".CasaVista__extra")].map(
        (node) => node.innerText.toLowerCase()
      );

      const stars = parseInt(
        document.querySelector(".Opiniones__numero-de-estrellas").innerText
      );

      const numReviews = Number(
        document
          .querySelector(".Opiniones__numero-de-opiniones")
          .innerText.replace(/[^0-9]/g, "")
      );

      const houseReviews = [
        ...document.querySelectorAll(".Opinion__autor"),
        ...document.querySelectorAll(".Opinion div div.Opinion__autor + div"),
        ...document.querySelectorAll(".Opinion__texto"),
      ].map((review) => review.innerText);

      let reviewList = [];
      const reviewListLength = houseReviews.length / 3;

      for (let i = 0; i < reviewListLength; i++) {
        reviewList.push({
          author: houseReviews[i],
          description: houseReviews[i + 2 * reviewListLength],
          date: houseReviews[i + reviewListLength],
        });
      }

      return {
        images,
        title,
        location,
        price,
        conforts,
        services,
        stars,
        numReviews,
        reviewList,
        url: window.location.href,
      };
    });

    houses.push(homeDetails);
  }

  //Guardar data en un json
  /*  const data = JSON.stringify(houses);

  fs.writeFileSync(path.join(__dirname, "houses.json"), data); */

  //Guardar data en mongoDB
  await saveHouse(houses);

  console.log("Casas guardadas");

  await browser.close(); //Cierra el navegador y termina el proceso

  process.exit(); //Para indicar que el archivo se terminó de ejecutarse
})();
