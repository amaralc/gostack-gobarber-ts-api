# gostack-gobarber-ts-api

Documentação: [clique aqui](https://www.notion.so/2208cd9c974042b6ae5728186643ec7a?v=4f34c3517db840c6b7d736b4020b2106)

# Funcionalidades macro

## Recuperação de senha

  **Requisitos Funcionais (RF)**

    - O usuário deve poder recuperar sua senha informando seu email
    - O usuário deve receber um e-mail com instruções de recuperação de senha;
    - O usuário deve poder resetar sua senha;

  **Requisitos não Funcionais (RNF)**

    - Utilizar mailtrap para testar envios em ambiente de desenvolvimento;
    - Utilizar Amazon SES para envios em produção (12 meses gratuito, 100mil emails por mês... etc);
    - Envio de emails deve acontecer em segundo plano (background job);

  **Regras de Negócio (RN)**

    - O link enviado para o email para resetar a senha, deve expirar em 2 horas;
    - O usuário precisa confirmar sua senha ao resetar sua senha;



## Atualização de perfil

  **Requisitos Funcionais (RF)**

    - O usuário deve poder atualizar seu nome, email e senha;

  **Regras de Negócio (RN)**

    - Usuário não pode alterar seu e-mail para um email já utilizado;
    - Para atualizar sua senha, o usuário deve informar a senha antiga;
    - Para atualizar sua senha, o usuário precisa confirmar a nova senha;

## Painel do prestador

  **Requisitos Funcionais (RF)**

    - Usuário deve poder listar seus agendamentos de um dia específico;
    - O prestador deve receber uma notificação sempre que houver um novo agendamento;
    - O prestador deve poder visualizar as notificações não lidas;

  **Requisitos Não Funcionais (RNF)**

    - Os agendamentos do prestador no dia devem ser armazenados em cache;
    - As notificações do prestador devem ser armazenadas no MongoDB;
    - As notificações do prestador devem ser enviadas em tempo real utilizando Socket.io;

  **Regras de Negócio (RN)**

    - A notificação deve ter um status de lida ou não lida para controle do prestador;



## Agendamento de serviços

  **Requisitos Funcionais (RF)**

    - O usuário deve poder listar todos os prestadores de serviços cadastrados;
    - O usuário deve poder listar os dias do mês com pelomenos um horário disponível para um determinado prestador;
    - O usuário deve poder listar horários de um prestador, disponíveis em um dia específico;
    - O usuário deve poder realizar um novo agendamento com um prestador;

  **Requisitos Não Funcionais (RNF)**

    - Listagem de prestadores deve ser armazenada em cache;

  **Regras de Negócio (RN)**

    - Cada agendamento deve durar exatamente 1h;
    - Os agendamentos devem estar disponíveis das 8 às 18h (primeiro às 8h, último às 17h);
    - Usuário não pode realizar agendamento em um horário já ocupado;
    - Usuário não pode agendar em um horário que já passou;
    - Usuário não pode agendar serviços consigo mesmo;

