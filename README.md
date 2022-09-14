# instalar os pacotes node
npm install

# Para iniciar o projeto utilize o
ng serve

# gerar arquivo de build prod
ng build --prod --buildOptimizer --aot --base-href="/novo-candidato/"

# Configuração para o servidor IIS

Após o build do projeto, remova 2 linhas do arquivo ngsw.json:

    "/novo-candidato/index.html": "TOKEN",

    "/novo-candidato/styles.6510c981f84b0e8e41a4.css": "TOKEN"

Para os dois arquivos entrarem no cache do navegador