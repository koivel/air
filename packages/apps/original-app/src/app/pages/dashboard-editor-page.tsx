import DashboardEditor from '../components/dashboard-editor/dashboard-editor';
import { KoivelDashboardEditorProvider } from '../contexts/koivel-dashboard-editor';

const DashboardEditorPage = () => {
  return (
    <div className="h-full">
      <KoivelDashboardEditorProvider>
        <DashboardEditor />
      </KoivelDashboardEditorProvider>
    </div>
  );
};

export default DashboardEditorPage;
