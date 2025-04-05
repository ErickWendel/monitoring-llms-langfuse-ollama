# Monitoring AI Calls with Langfuse

This project demonstrates how to implement request tracing and monitoring for OpenAI SDK calls using Langfuse. It provides a ready-to-use setup with Docker Compose for easy deployment on VPS environments.

> ⚠️ **Production Notice**: This setup is intended for development and testing. For production environments:
> - Use Docker Swarm or Kubernetes instead of Docker Compose for better scalability and orchestration
> - Configure SSL/TLS certificates (not included in this setup)
> - Update all default credentials
> - Consider implementing proper load balancing

## 🎯 Overview

Monitor and analyze your AI application's performance, costs, and behavior using Langfuse's powerful observability platform. This implementation uses the official Langfuse Docker Compose setup for self-hosting and includes Ollama integration for local LLM support.

## 🚀 Features

- Self-hosted Langfuse instance
- OpenAI SDK integration
- Ollama integration with gemma:2b model
- Request tracing and monitoring
- Cost analysis
- Performance metrics
- Prompt management
- Evaluation capabilities
- Automatic model downloading

## 🛠 Prerequisites

- Docker and Docker Compose installed
- Basic understanding of Docker and containerization

## 📦 Installation

1. Clone this repository:
```bash
git clone https://github.com/erickwendel/monitoring-llms-langfuse-ollama.git
cd monitoring-llms-langfuse-ollama
```

2. Configure environment variables:

The project includes a default `.env` file with pre-configured settings:

- Default Langfuse API keys (ready to use)
- Ollama configuration (using gemma:2b model)
- Pre-configured user credentials:
  - Email: erickwendel@test.com
  - Password: admin@123
- Domain configuration (defaults to localhost, update DOMAIN for production)

3. Start the Langfuse stack:
```bash
docker compose up -d
```

This will:
- Start all Langfuse components
- Launch Ollama server
- Automatically download and configure the gemma:2b model
- Initialize the monitoring stack

4. Access the Langfuse UI:
```
http://localhost:3000
```

5. restore the app's dependencies and run it:
```sh
npm ci
npm run dev
```

6. make requests
```sh
sh scripts/run-request.sh
```
## 🔧 Configuration

The project uses the official Langfuse Docker Compose configuration with the following main components:

- Langfuse Web UI
- PostgreSQL database
- Redis
- ClickHouse
- MinIO (for blob storage)
- Ollama (for local LLM support)
- Ollama Model Loader (automatically downloads required models)

### Environment Variables

Key environment variables in `.env`:

```env
OPENAI_MODEL='gemma:2b'
DOMAIN=srv665452.hstgr.cloud  # Update this for production
OPENAI_SITE_URL=http://${DOMAIN}:11434/v1
OPENAI_API_KEY='ollama'
OPENAI_SITE_NAME='Ollama'

# Pre-configured Langfuse keys
LANGFUSE_SECRET_KEY="sk-lf-fcc57d58-e494-421e-97d2-45e9c3302313"
LANGFUSE_PUBLIC_KEY="pk-lf-93c16cbd-c4f0-4b68-880e-5f1da1038032"
```

## 🏗 Architecture

The setup follows Langfuse's recommended architecture for self-hosted instances:

- Frontend container exposed on port 3000
- Ollama service on port 11434
- Secure internal network for components
- Persistent volume storage for databases
- MinIO for object storage
- Automatic model management through Ollama

## 🔐 Security Considerations

- Update all default passwords in the Docker Compose file
- Configure proper firewall rules
- Use SSL/TLS for production deployments (not included in base setup)
- Implement proper authentication mechanisms
- Consider changing the default Langfuse API keys in production
- Set up proper network segmentation
- Implement rate limiting
- Configure regular security updates

## 📈 Monitoring

Access your Langfuse dashboard to view:

- Request traces
- Response times
- Token usage
- Cost analytics
- Prompt performance
- Model behavior
- Ollama model performance metrics

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Langfuse](https://langfuse.com) for their excellent observability platform
- [Hostinger](https://hostinger.com) for VPS hosting capabilities
- [Ollama](https://ollama.ai) for local LLM support
- OpenAI for their SDK

## 📞 Support

If you encounter any issues or have questions, please open an issue in this repository. 