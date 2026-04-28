export interface LoudlyConfig {
  content: {
    repo: string;
    branch: string;
    path: string;
  };
  site: {
    title: string;
    description: string;
    url?: string;
    logo?: string;
    defaultOgImage?: string;
  };
}
