
import usuarios from './usuarios_mock.json' with {type: 'json'}



export function dadosUsuarios(req, res) {
    try {
        const usuairoFormatado = usuarios.map(usuario => ({
            ...usuario,
            nome: usuario.nome.toUpperCase()
        }));
        res.json({
            Total:usuairoFormatado.length,
            usuarios: usuairoFormatado
        })
    } catch (error) {
        res.status(500).json({ erro: ' Erro ao preocessar usuário' })
    }

}

export function usuarioIdade33(req, res) {
    try {
        const filtrados = usuarios.filter(usuario => usuario.idade === 33)
        res.json(filtrados)

    } catch (error) {
        res.status(500).json({ error: 'Erro ao processar idade ' })
    }
}

export function usuarioDataCriacao(req, res) {
    try {
        const { data } = req.params; //variavel que recebe a data
        const dataFiltro = new Date(data); // converte o valor para a data

        if (isNaN(dataFiltro.getTime())) {
            return res.status(400).json({ error: 'Data inválida' });
        }
        const filtrados = usuarios.filter(usuario => {
            const dataCriacao = new Date(usuario.criado_em);
            return dataCriacao <= dataFiltro;
        });

        res.json(filtrados);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao filtrar por data' });
    }
}

export function filtraUsuario(req, res) {
    try {
        let resultado = usuarios
        const { nome, email, idade, criado_em } = req.query

        if (nome) {
            resultado = resultado.filter(usuario => usuario.nome.toLowerCase().includes(nome.toLowerCase()));
        }
        if (email) {
            resultado = resultado.filter(usuario => usuario.email.toLowerCase().includes(email.toLowerCase()))
        }
        if (idade) {
            resultado = resultado.filter(usuario => usuario.idade === Number(idade))
        }
        if (criado_em) {
            const dataFiltrada = new Date(criado_em)
            if (isNaN(dataFiltrada.getTime()))
                return res.status(400).json({ error: 'Data invalida' })

            resultado = resultado.filter(usuario => new Date(usuario.criado_em) <= dataFiltrada)
        }
        res.json({
            total: resultado.length,
            usuarios: resultado
        })
    } catch (error) {
        res.status(500).json({ error: 'Erro no servidor ' })
    }
}