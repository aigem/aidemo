import { GradioApp } from '../types/app';

export function exportApps(apps: GradioApp[]): void {
  const dataStr = JSON.stringify(apps, null, 2);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
  
  const exportFileDefaultName = `gradio-apps-${new Date().toISOString()}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

export async function importApps(file: File): Promise<GradioApp[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const apps = JSON.parse(e.target?.result as string);
        if (Array.isArray(apps) && apps.every(isValidApp)) {
          resolve(apps);
        } else {
          reject(new Error('Invalid file format'));
        }
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

function isValidApp(app: any): app is GradioApp {
  return (
    typeof app === 'object' &&
    typeof app.directUrl === 'string' &&
    typeof app.name === 'string' &&
    typeof app.description === 'string'
  );
}