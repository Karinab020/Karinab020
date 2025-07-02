# Mureka Clone – AI Music Generator

Este repositório contém um protótipo open-source de um aplicativo web de geração de músicas com IA, inspirado no **Mureka AI**.

## Visão geral

* **Backend**: [FastAPI](https://fastapi.tiangolo.com/) em Python (veja `backend/`)
* **Frontend**: Página HTML/JS vanilla super-simples (veja `frontend/`)
* **Geração de áudio**: Atualmente um _stub_ que gera um arquivo MP3 silencioso de 1 segundo.  Basta substituir a função `_stub_generate_song` (em `backend/main.py`) por uma chamada real a um serviço/modelo de IA (por exemplo, [Replicate](https://replicate.com/), Hugging Face Inference API, MusicGen, Suno, etc.).

## Como executar localmente

1. Clone o repositório e entre na pasta:

   ```bash
   git clone <repo_url>
   cd <repo>/backend
   ```

2. Crie um ambiente virtual e instale as dependências:

   ```bash
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

3. (Opcional) Configure variáveis de ambiente no arquivo `.env` caso utilize um provedor externo — ex.:  `REPLICATE_API_TOKEN=xxxx`.

4. Inicie a API:

   ```bash
   uvicorn main:app --reload
   ```

5. Abra o frontend (`frontend/index.html`) em seu navegador.  Por padrão ele espera que o backend esteja em `http://localhost:8000`.

## Próximos passos / ideias

* Integrar com o modelo **MusicGen** da Meta ou qualquer outro gerador de áudio.
* Adicionar autenticação de usuários e créditos.
* Permitir download de _stems_ (vocal, instrumental).
* Implementar edição/extend de trechos.
* Criar versão mobile com React Native ou Flutter.

Contribuições são bem-vindas! ✨
