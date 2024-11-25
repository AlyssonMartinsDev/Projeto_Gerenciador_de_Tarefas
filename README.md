
# Sistema de Gerenciamento de Tarefas

Este é um sistema simples de gerenciamento de tarefas desenvolvido com **Node.js**, **Express** e **Handlebars**. O objetivo é permitir a criação, edição, visualização e exclusão de tarefas de forma organizada e intuitiva.

---

## ⚙️ Como Executar o Projeto  

1. Clone o repositório:  
   ```bash  
   git clone https://github.com/AlyssonMartinsDev/Projeto_Gerenciador_de_Tarefas.git  
   ```  
2. Acesse o diretório do projeto:  
   ```bash  
   cd sistema-gerenciamento-tarefas  
   ```  
3. Instale as dependências:  
   ```bash  
   npm install  
   ```  
4. Inicie o servidor:  
   ```bash  
   npm start  
   ```  
5. Acesse o sistema no navegador:  
   ```  
   http://localhost:3000/dashboard  
   ```  

---  

## 🛡️ Segurança  

O sistema utiliza **JSON Web Tokens (JWT)** para garantir que apenas usuários autenticados possam acessar as rotas protegidas.  

- Todas as rotas privadas exigem um token válido para acesso.  
- O backend inclui middlewares para verificar a validade e integridade do token.  
- Dados sensíveis, como senhas, são tratados com boas práticas de segurança.  

---  

## 🛠️ Recursos Adicionais  

- **Redirecionamento eficiente:** Após o login, os usuários são direcionados para uma página de carregamento antes de acessar a dashboard.  
- **Edição dinâmica de tarefas:** Modais criados com Bootstrap 5 permitem editar tarefas com os campos já preenchidos.  
- **Feedback visual:** Interações visuais melhoram a experiência do usuário, informando ações como criação ou edição de tarefas.  

---

## 🚀 Tecnologias Utilizadas  

- **Node.js** para o backend;  
- **Express** como framework web;  
- **Handlebars** para renderização de templates dinâmicos;  
- **SQLite** como banco de dados;  
- **Bootstrap 5** para estilização e criação de modais responsivos;  
- **JSON Web Token (JWT)** para autenticação segura.  

---

## 💡 Possíveis Melhorias Futuras  

- Adicionar suporte a múltiplos usuários com permissões específicas.  
- Implementar notificações para prazos de tarefas.  
- Adicionar filtros e ordenação nas listagens de tarefas.  

---

## 🤝 Contribuindo  

Sinta-se à vontade para contribuir com melhorias ou sugestões! Faça um fork do projeto, crie uma nova branch e envie um pull request.  

---


