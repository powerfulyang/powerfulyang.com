type Parameters = {
  COLUMNS: string;
  SCHEMA: string;
  operationId: string;
  description: string;
  tag: string;
};

export const snippet = (params: Parameters) => {
  const { COLUMNS, SCHEMA, operationId, description, tag } = params;
  const code = `
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ProStrictColumns } from '@/types/ProStrictColumns';
import { paginateTableRequest } from '@/utils/paginateTableRequest';
import { ${operationId} } from '@/services/swagger/${tag}';

const Index = () => {
  const columns: ProStrictColumns<API.${SCHEMA}>[] = ${COLUMNS};
  return (
    <PageContainer title={false}>
      <ProTable
        rowKey="id"
        headerTitle="${description}"
        columns={columns}
        scroll={{ x: 'max-content' }}
        request={paginateTableRequest(${operationId})}
      />
    </PageContainer>
  );
};

export default Index;
`;

  return code.trim();
};
