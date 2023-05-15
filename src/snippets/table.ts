import { camelCase, capitalize } from 'lodash-es';

type Parameters = {
  COLUMNS: string;
  SCHEMA: string;
  operationId: string;
};

export const snippet = (params: Parameters) => {
  const { COLUMNS, SCHEMA, operationId } = params;
  const schema = camelCase(SCHEMA);
  const Schema = capitalize(SCHEMA);
  const code = `
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ProColumnDetectType } from '@/types/ProColumnDetectType';
import { paginateTableRequest } from '@/utils/paginateTableRequest';
import { ${operationId} } from '@/services/swagger/${schema}';

const Index = () => {
  const columns: ProColumnDetectType<API.${Schema}>[] = ${COLUMNS};
  return (
    <PageContainer title={false}>
      <ProTable
        rowKey="id"
        headerTitle="Asset List"
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
