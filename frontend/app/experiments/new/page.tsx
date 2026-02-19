import { ExperimentForm } from "../../components/ExperimentForm";
import { PageLayout } from "../../community/PageLayout";
export default function NewExperimentPage() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-slate-900">
            <PageLayout>
      <ExperimentForm />
    </PageLayout>
        </main>
    );
}
