const http = require("http");
const fs = require("fs");
const url = require("url");
const axios = require("axios");

const url_clientes =
  "https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json";

const url_proveedores =
  "https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json";

const render = (ruta, callback) => {
  fs.readFile("./index.html", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let pageContent = data.toString();
      let textReplacement = "";
      let url = "";
      if (ruta == "Clientes") {
        url = url_clientes;
      } else {
        url = url_proveedores;
      }

      axios
        .get(url)
        .then((response) => {
          response.data.forEach((element) => {
            textReplacement += `<tr>
          <td>${
            ruta == "Clientes" ? element.idCliente : element.idproveedor
          }</td>
          <td>${
            ruta == "Clientes" ? element.NombreCompania : element.nombrecompania
          }</td>
          <td>${
            ruta == "Clientes" ? element.NombreContacto : element.nombrecontacto
          }</td>
        </tr>`;
          });
        })
        .then(() => {
          pageContent = pageContent.replace(
            "{{replace_contenido}}",
            textReplacement
          );
          pageContent = pageContent.replace("{{replace_nombre}}", ruta);
          pageContent = pageContent.replace("{{replace_nombre_table}}", ruta);
          callback(pageContent);
        });
    }
  });
};

http
  .createServer((req, res) => {
    let pathname = url.parse(req.url).pathname;
    if (pathname == "/clientes") {
      
      render("Clientes", (data) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data.toString());
      });
    } else if (pathname == "/proveedores") {
      
      render("Proveedores", (data) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data.toString());
      });
    }
  })
  .listen(8081);