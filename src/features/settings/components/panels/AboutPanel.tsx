import { Github } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AboutPanel() {
    const { t } = useTranslation();

    return (
        <>
        <div className="mt-2 flex flex-col gap-2">
            <p>{t('common.settings.about.description')}</p>
            <a
                href="https://github.com/poixeai/translate"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 w-fit rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
                <Github className='w-5 h-5'/>
                {t('common.settings.about.github')}
            </a>
        </div>
        </>
    )
}