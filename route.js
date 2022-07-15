const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando!");
});

app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");

//IMPORTANDO USUARIOS
const Usuario = require("./models/Usuario");

//config da sessão

app.use(
  session({
    secret: "123456",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.static("views"));

app.get("/", (req, res) => {
  if (req.session.errors) {
    erros = req.session.erros;
    req.session.erros = [];

    return res.render("cadastrar", { erros: erros, sucesso: false });
  }

  if (req.session.sucess) {
    req.session.succes = false;
    return res.render("cadastrar", { erros: [], sucesso: true });
  }

  res.render("cadastrar", { erros: req.session.erros, sucesso: false });
});

app.get("/listarUsuarios", (req, res) => {
  console.log('entrou no get');
  Usuario.findAll().then((users) => {
    if (users.length > 0) {
      return res.render("listarUsuarios", {
        table: true,
        users: users.map((user) => {
          console.log(user.toJSON());
          return user.toJSON();
        }),
      });
    } else {
      return res.render("listarUsuarios", { table: false });
    }
  });
});

app.post("/editar", (req, res)=> {
  const id = req.body.id;

  //VERIFICANDO SE O ID EXISTE

  Usuario.findByPk(id).then((value)=>{
    return res.render("editar", {error: false, id: value.id, nome: value.nome, email: value.email});
  }).catch((err) => {
    console.log('erro: '+ err);
    return res.render("editar", {error: true, message: "não foi possivel editar este usuário!"});
  })

})

app.post("/update", (req,res)=> {

  var id = req.body.id;
  var nome = req.body.nome;
  var email = req.body.email;

  const erros = [];

  //removendo espaços em brancos
  nome = nome.trim();
  email = email.trim();

  // Nome vazio
  if (typeof nome == undefined || nome == "" || nome == null) {
    erros.push({ message: "Este nome é vazio!" });
  }

  //nome valido - APENAS LETRAS

  regex_nome_valido = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/;

  if (!regex_nome_valido.test(nome)) {
    erros.push({ message: "Este nome é inválido!" });
  }

  //email nào pode ser vazio!

  if (email == "" || typeof email == undefined || email == null) {
    erros.push({ message: "Email não pode ser vazio!" });
  }

  //email valido

  regex_email_valido =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!regex_email_valido.test(email)) {
    erros.push({ message: "Email inválido!" });
  }

  //QUANDO TEM ERROS

  if (erros.length > 0) {
    console.log(erros);
    return res.status(400).send({status: 400, erros: erros});
  }


  //EM CASO DE SUCESSO

  Usuario.update({
    nome: nome,
    email: email.toLowerCase()
  }, {
    where: {
      id: id
    }
  }).then((resultado) =>{
    console.log(resultado);
    return res.redirect('listarUsuarios')
  }).catch((err) => {
    console.log(err);
  })
})

app.post("/excluir", (req, res) => {

  var id = req.body.id;

  Usuario.destroy({
    where: {
      id: id
    }
  }).then(()=> {
    console.log("excluido com sucesso!");
    res.redirect("listarUsuarios");
  }).catch((err)=> {
    console.log("erro: " + err);
    res.redirect("listarUsuarios");
  })

})

app.post("/cadastrar", (req, res) => {
  nome = req.body.nome;
  email = req.body.email;

  const erros = [];

  //removendo espaços em brancos
  nome = nome.trim();
  email = email.trim();

  // Nome vazio
  if (typeof nome == undefined || nome == "" || nome == null) {
    erros.push({ message: "Este nome é vazio!" });
  }

  //nome valido - APENAS LETRAS

  regex_nome_valido = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/;

  if (!regex_nome_valido.test(nome)) {
    erros.push({ message: "Este nome é inválido!" });
  }

  //email nào pode ser vazio!

  if (email == "" || typeof email == undefined || email == null) {
    erros.push({ message: "Email não pode ser vazio!" });
  }

  //email valido

  regex_email_valido =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!regex_email_valido.test(email)) {
    erros.push({ message: "Email inválido!" });
  }

  //QUANDO TEM ERROS

  if (erros.length > 0) {
    console.log(erros);

    req.session.erros = erros;
    req.session.sucess = false;
    return res.redirect("/");
  }

  //SEM ERROS E SUCESSO
  req.session.sucess = true;

  Usuario.create({
    nome: nome,
    email: email.toLowerCase(),
  })
    .then(() => console.log("usuario cadastrado com sucesso!"))
    .catch((erro) => console.log(erro));

  return res.redirect("/");
});
