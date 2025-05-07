declare module Note {
	export interface Note {
        id: string;
        title: string;
        content: string;
        createdAt: string;
        tag: string;
        important?: boolean;
        pinned?: boolean;
      }
}