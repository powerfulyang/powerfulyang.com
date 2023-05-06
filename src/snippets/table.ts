type Parameters = {
  COLUMNS: string;
};

export const snippet = (params: Parameters) => {
  const { COLUMNS } = params;
  const code = `
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ProColumnDetectType } from '@/types/ProColumnDetectType';
import { paginateTableRequest } from '@/utils/paginateTableRequest';
import { queryAssets } from '@/services/swagger/asset';

const Index = () => {
  const columns: ProColumnDetectType<API.Asset>[] = ${COLUMNS};
  return (
    <PageContainer title={false}>
      <ProTable
        rowKey="id"
        headerTitle="Asset List"
        columns={columns}
        scroll={{ x: 'max-content' }}
        request={paginateTableRequest(queryAssets)}
      />
    </PageContainer>
  );
};

export default Index;
`;

  return code.trim();
};
