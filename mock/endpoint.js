import gjeldersok from "./POST_GjelderSok.json";

export default [
  {
    url: "/oppdrag-api/api/v1/attestasjon/gjeldersok",
    method: "POST",
    response: () => gjeldersok,
  },
  ];
