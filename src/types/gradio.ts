export interface GradioAppProps {
  src: string;
  className?: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'gradio-app': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src: string;
      };
    }
  }
}