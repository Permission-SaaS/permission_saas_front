import { Card, CardBody, CardHeader } from "@/shared";

export function ProjectNotFound() {
  return (
    <Card>
      <CardHeader>Projeto não encontrado</CardHeader>
      <CardBody>
        O endereço pode estar errado, ou o projeto pode já ter sido excluído.
      </CardBody>
    </Card>
  );
}
