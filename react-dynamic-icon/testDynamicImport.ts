// 测试动态导入功能
/* @vite-ignore */
export const testLucideImport = async () => {
  try {
    console.log('Testing lucide-react import...');
    const lucide = await import('lucide-react');
    console.log('Lucide import successful:', lucide);
    console.log('Lucide exports:', Object.keys(lucide).slice(0, 10));
    return Object.keys(lucide);
  } catch (error) {
    console.error('Lucide import failed:', error);
    return [];
  }
};

export const testReactIconsImport = async () => {
  try {
    console.log('Testing react-icons/md import...');
    const md = await import('react-icons/md');
    console.log('MD import successful:', md);
    console.log('MD exports:', Object.keys(md).slice(0, 10));
    return Object.keys(md);
  } catch (error) {
    console.error('MD import failed:', error);
    return [];
  }
};
