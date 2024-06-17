import personsok from "./POST_PersonSok.json";

export default [
  {
    url: "/mikrofrontend-api/api/employee",
    method: "GET",
    response: () => {
      return [
        {
          id: 1,
          navn: "Ola Nordmann",
          yrke: "Tech Lead",
        },
        {
          id: 2,
          navn: "Kari Nordmann",
          yrke: "Prosjektleder",
        },
      ];
    },
  },
{
  url: "/api/v1/attestasjon/personsok",
  method: "POST",
  response: () => personsok,
},
];
