import personsok from "./POST_PersonSok.json";

export default [
  {
    url: "/oppdrag-api/api/v1/attestasjon/personsok",
    method: "POST",
    response: () => personsok,
  },
  ];
