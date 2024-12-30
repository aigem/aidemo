/** @jsxImportSource react */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppViewer } from '../components/AppViewer';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useApps } from '../contexts/AppContext';
import { SEO } from '../components/SEO';
import type { App } from '../services/appService';

export function AppDetailPage() {
    const { appId } = useParams<{ appId: string }>();
    const navigate = useNavigate();
    const { apps, loading, error } = useApps();
    const [currentApp, setCurrentApp] = useState<App | null>(null);

    useEffect(() => {
        if (!loading && apps.length > 0 && appId) {
            const normalizedAppId = appId.replace(/\/$/, '');
            const app = apps.find(app => app.directUrl === normalizedAppId);
            if (app) {
                setCurrentApp(app);
            } else {
                navigate('/404');
            }
        }
    }, [appId, apps, loading, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingSpinner size="large" message="加载应用详情..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-700">{error}</p>
                </div>
            </div>
        );
    }

    if (!currentApp) {
        return null;
    }

    return (
        <>
            <SEO app={currentApp} />
            <AppViewer
                app={currentApp}
                onClose={() => navigate('/')}
            />
        </>
    );
} 