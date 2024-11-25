// Imports
const express = require('express');
const path = require('path');
const dbconn = require('./database/db');
const hbs = require('handlebars');
const app = express();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// utils
const { isValidEmail } = require('./utils/validators')

// Definições do servidor
app.set('view engine', 'hbs'); // Define o handlebars como template engine
app.set('views', path.join(__dirname, 'views')); // Configuração do diretorio onde os templates estão armazenados
app.use(express.static(path.join(__dirname, 'public'))); // Configuração do diretorio onde os arquivos estáticos estão armazenados
app.use(express.urlencoded({ extended: true })); // Configuração para que o express possa entender o formato do corpo da requisição
app.use(express.json()); // Configuração para que o express possa entender o formato JSON da requisição

// MIDDLEWARE
const veryfyToken = require('./middleware/authenticateToken');
const JWT_SECRET = "TaskManager2024"

// Rotas

// LOGIN 
app.get('/login', (req, res) => {
    res.render('login')
});

app.post('/login', (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ error: 'Preencha todos os campos' })
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Email invalido' })
    }

    dbconn.get(
        'SELECT name, email, password FROM users WHERE email = ?', [email], async (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Ocorreu um erro, tente novamente mais tarde.' })
            }

            if (!user) {
                return res.status(404).json({ error: 'Email ou senha incorretos.' })
            }

            const isMatch = await bcrypt.compare(password, user.password) // Verifica se a senha está correta

            if (!isMatch) {
                return res.status(401).json({ error: "Email ou senha incorretos." })
            }

            const token = jwt.sign({ id: user.user_id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' })

            return res.status(200).json({
                nome: user.name,
                id: user.user_id,
                token
            })


        }
    )




});


// Register
app.post('/register', async (req, res) => { // register OK
    const { name, email, password, confirmPassword } = req.body

    if (!name || !email || !password || !confirmPassword) {

        return res.status(400).json({ error: 'Nome, Email, Senha e Confirmação de Senha são obrigatorios.' })
    }

    if (name.length < 5) {
        return res.status(400).json({ error: 'Nome deve ter pelo menos 5 caracteres' });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Por favor digite um email válido.' })
    }

    if (password.length < 5) {
        return res.status(400).json({ error: 'A senha precisa ter no minímo 5 caracteres.' })
    }
    if (confirmPassword.length < 5) {
        return res.status(400).json({ error: 'A confirmação de senha precisa ter no minímo 5 caracteres.' })
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'As senhas não são igauais.' })
    }

    dbconn.get('SELECT email FROM users WHERE email = ?', [email], async (err, row) => {
        if (err) {
            console.error('Erro ao verificar a existencia do email:' + err.message)
            return res.status(500).json({ error: 'Ocorreu um erro tente novamente mais tarde' })
        }

        if (row) {
            return res.status(400).json({ error: 'Email ja cadastrado' })
        }

        try {
            const passHash = await bcrypt.hash(password, 10)



            dbconn.run(
                'INSERT INTO users (name, email, password) values (?,?,?)',
                [name, email, passHash],

                function (err) {
                    if (err) {
                        console.error("Erro ao registrar o usuário: ", err.message)
                        return res.status(500).json({ error: 'Ocorreu um erro! Tente novamente mais tarde.' })

                    }
                    res.status(201).json({ success: 'Usuário cadastrado com sucesso.' })

                }
            )

        } catch (error) {

            console.error('Erro no pocesso de registro: ' + error.message)
            return res.status(500).json({ error: 'Ocorreu um erro! Tente novamente mais tarde.' })
        }
    })


})

app.get('/register', (req, res) => {
    res.render('register')
})


//Dashboard
app.get('/dashboard', async (req, res) => {

    try {

        const query = 'SELECT * FROM tasks;';

        dbconn.all(query, (err, rows) => {

            if (err) {
                console.error('Erro ao buscar os dados no banco de dados. ' + err.message);
                return res.status(500).json({ error: 'Ocorreu um erro! Tente novamente mais tarde.' });
            }




            res.render('dashboard', { data: rows })
        })

    } catch (error) {
        return res.redirect('/login')
    }
})

app.post('/verifyToken', async (req, res) => {

    const token = req.headers['authorization'].split(' ')[1];

    if (!token) return res.status(403).json({ error: 'Token não fornecido.' });


    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Token invalido' });

        req.uer = decoded;

        return res.status(200).json({ success: 'Token e válido' })

    })
})



// Tarefas
app.post('/tasks', veryfyToken, (req, res) => {
    const { tittle, description } = req.body;


    try {

        if (!tittle || !description) {
            return res.status(400).json({ error: 'Título e descrição são obrigatórios' })
        }


        const query = 'INSERT INTO tasks (title, description) VALUES (?, ?);';

        dbconn.run(query, [tittle, description], (err) => {
            if (err) {
                console.error('Erro ao criar o registro no banco de dados. ' + err.message);
                return res.status(500).json({ error: 'Ocorreu um erro! Tente novamente mais tarde.' });
            }
            res.status(201).json({ success: 'Tarefa criada com sucesso!' })
        })

    } catch (error) {
        console.error('Erro ao criar uma task: ' + error)

        res.status(500).json({ error: 'Ocorreu um erro tente novamente mais tarde.' })

    }
});

app.patch('/tasks/:id', veryfyToken, (req, res) => {
    const { id } = req.params;
    try {
        const { tittle, description } = req.body;

        const query = 'UPDATE tasks SET title = ?, description = ? WHERE id = ?;';

        dbconn.run(query, [tittle, description, id], function (err) {
            if (err) {
                console.error('Erro ao atualizar a tarefa: ' + err.message)
                return res.status(500).json({ error: 'Ocorreu um erro tente novamente mais tarde.' })
            }


            if (this.changes === 0) {
                return res.status(404).json({ error: 'Tarefa não encontrada.' })

            }

            return res.status(200).json({ success: 'Tarefa editada com sucesso.' })
        })
    } catch (error) {

        console.error('Ocorreu um erro, tente novamente mais tarde.' + error)
        res.status(500).json({ error: 'Ocorreu um erro tente novamente mais tarde.' })
    }

})

app.put('/tasks/:id', veryfyToken, (req, res) => {
    const { id } = req.params;

    try {
        const query = 'UPDATE tasks SET completed = 1 WHERE id = ?;';

        dbconn.run(query, [id], function (err) {
            if (err) {
                console.error('Erro ao atualizar a tarefa: ' + err.message)
                return res.status(500).json({ error: 'Ocorreu um erro tente novamente mais tarde.' })
            }


            if (this.changes === 0) {
                return res.status(404).json({ error: 'Tarefa não encontrada.' })

            }

            return res.status(200).json({ success: 'Tarefa atualizada com sucesso.' })
        })


    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Ocorreu um erro. Tente novamente mais tarde.' })

    }
})

app.delete('/tasks/:id', veryfyToken, (req, res) => {
    const { id } = req.params


    try {
        const query = 'DELETE FROM tasks WHERE id = ?;';

        dbconn.run(query, [id], function (err) {
            if (err) {
                console.error('Erro ao deletar a tarefa: ' + err.message)
                return res.status(500).json({ error: 'Ocorreu um erro tente novamente mais tarde.' })
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'Tarefa não encontrada.' })
            }

            return res.status(200).json({ success: 'Tarefa deletada com sucesso.' })
        })
    } catch (error) {
        console.error("ocorreu um erro: " + error)
        res.status(500).json({ error: 'Ocorreu um erro. Tente novamente mais tarde.' })
    }
})


// Servidor
const port = 3000;
app.listen(port || 3000, () => {
    console.log(`Servidor rodando na porta ${port}`);
});




