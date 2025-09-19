import type { IconLibConfig, IconPrefix } from '../types/icon';

/**
 * 图标库配置
 */
export const ICON_LIBRARIES: Record<IconPrefix, IconLibConfig> = {
  // Lucide React
  lr: {
    name: 'Lucide React',
    prefix: 'lr',
    loader: async (iconName: string) => {
      try {
        const module = await import('lucide-react');
        // 使用类型断言来解决索引签名问题
        return (module as any)[iconName] || null;
      } catch (error) {
        console.warn(`Failed to load Lucide React icon: ${iconName}`, error);
        return null;
      }
    },
    defaultProps: {
      strokeWidth: 2,
    },
  },

  // Ant Design Icons
  ai: {
    name: 'Ant Design Icons',
    prefix: 'ai',
    loader: async (iconName: string) => {
      try {
        const module = await import('react-icons/ai');
        return (module as any)[iconName] || null;
      } catch (error) {
        console.warn(`Failed to load Ant Design icon: ${iconName}`, error);
        return null;
      }
    },
  },

  // Bootstrap Icons
  bi: {
    name: 'Bootstrap Icons',
    prefix: 'bi',
    loader: async (iconName: string) => {
      try {
        const module = await import('react-icons/bi');
        return (module as any)[iconName] || null;
      } catch (error) {
        console.warn(`Failed to load Bootstrap icon: ${iconName}`, error);
        return null;
      }
    },
  },

  // Circum Icons
  ci: {
    name: 'Circum Icons',
    prefix: 'ci',
    loader: async (iconName: string) => {
      try {
        const module = await import('react-icons/ci');
        return (module as any)[iconName] || null;
      } catch (error) {
        console.warn(`Failed to load Circum icon: ${iconName}`, error);
        return null;
      }
    },
  },

  // Devicons
  di: {
    name: 'Devicons',
    prefix: 'di',
    loader: async (iconName: string) => {
      try {
        const module = await import('react-icons/di');
        return (module as any)[iconName] || null;
      } catch (error) {
        console.warn(`Failed to load Devicon: ${iconName}`, error);
        return null;
      }
    },
  },

  // Font Awesome
  fa: {
    name: 'Font Awesome',
    prefix: 'fa',
    loader: async (iconName: string) => {
      try {
        const module = await import('react-icons/fa');
        return (module as any)[iconName] || null;
      } catch (error) {
        console.warn(`Failed to load Font Awesome icon: ${iconName}`, error);
        return null;
      }
    },
  },

  // Flat Color Icons
  fc: {
    name: 'Flat Color Icons',
    prefix: 'fc',
    loader: async (iconName: string) => {
      try {
        const module = await import('react-icons/fc');
        return (module as any)[iconName] || null;
      } catch (error) {
        console.warn(`Failed to load Flat Color icon: ${iconName}`, error);
        return null;
      }
    },
  },

  // Feather Icons
  fi: {
    name: 'Feather Icons',
    prefix: 'fi',
    loader: async (iconName: string) => {
      try {
        const module = await import('react-icons/fi');
        return (module as any)[iconName] || null;
      } catch (error) {
        console.warn(`Failed to load Feather icon: ${iconName}`, error);
        return null;
      }
    },
  },

  // Game Icons
  gi: {
    name: 'Game Icons',
    prefix: 'gi',
    loader: async (iconName: string) => {
      try {
        const module = await import('react-icons/gi');
        return (module as any)[iconName] || null;
      } catch (error) {
        console.warn(`Failed to load Game icon: ${iconName}`, error);
        return null;
      }
    },
  },

  // Github Octicons
  go: {
    name: 'Github Octicons',
    prefix: 'go',
    loader: async (iconName: string) => {
      try {
        const module = await import('react-icons/go');
        return (module as any)[iconName] || null;
      } catch (error) {
        console.warn(`Failed to load Github Octicon: ${iconName}`, error);
        return null;
      }
    },
  },

  // Grommet Icons
  gr: {
    name: 'Grommet Icons',
    prefix: 'gr',
    loader: async (iconName: string) => {
      try {
        const module = await import('react-icons/gr');
        return (module as any)[iconName] || null;
      } catch (error) {
        console.warn(`Failed to load Grommet icon: ${iconName}`, error);
        return null;
      }
    },
  },

  // Heroicons
  hi: {
    name: 'Heroicons',
    prefix: 'hi',
    loader: async (iconName: string) => {
      try {
        const module = await import('react-icons/hi');
        return (module as any)[iconName] || null;
      } catch (error) {
        console.warn(`Failed to load Heroicon: ${iconName}`, error);
        return null;
      }
    },
  },

  // Heroicons 2
  hi2: {
    name: 'Heroicons 2',
    prefix: 'hi2',
    loader: async (iconName: string) => {
      try {
        const module = await import('react-icons/hi2');
        return (module as any)[iconName] || null;
      } catch (error) {
        console.warn(`Failed to load Heroicon 2: ${iconName}`, error);
        return null;
      }
    },
  },

  // IcoMoon
  im: {
    name: 'IcoMoon',
    prefix: 'im',
    loader: async (iconName: string) => {
      try {
        const module = await import('react-icons/im');
        return (module as any)[iconName] || null;
      } catch (error) {
        console.warn(`Failed to load IcoMoon icon: ${iconName}`, error);
        return null;
      }
    },
  },

  // Ionicons 4
  io: {
    name: 'Ionicons 4',
    prefix: 'io',
    loader: async (iconName: string) => {
      try {
        const module = await import('react-icons/io');
        return (module as any)[iconName] || null;
      } catch (error) {
        console.warn(`Failed to load Ionicon 4: ${iconName}`, error);
        return null;
      }
    },
  },

  // Ionicons 5
  io5: {
    name: 'Ionicons 5',
    prefix: 'io5',
    loader: async (iconName: string) => {
      try {
        const module = await import('react-icons/io5');
        return (module as any)[iconName] || null;
      } catch (error) {
        console.warn(`Failed to load Ionicon 5: ${iconName}`, error);
        return null;
      }
    },
  },

  // Line Awesome
  lia: {
    name: 'Line Awesome',
    prefix: 'lia',
    loader: async (iconName: string) => {
      try {
        const module = await import('react-icons/lia');
        return (module as any)[iconName] || null;
      } catch (error) {
        console.warn(`Failed to load Line Awesome icon: ${iconName}`, error);
        return null;
      }
    },
  },

  // Material Design Icons
  md: {
    name: 'Material Design Icons',
    prefix: 'md',
    loader: async (iconName: string) => {
      try {
        const module = await import('react-icons/md');
        return (module as any)[iconName] || null;
      } catch (error) {
        console.warn(`Failed to load Material Design icon: ${iconName}`, error);
        return null;
      }
    },
  },

  // Phosphor Icons
  pi: {
    name: 'Phosphor Icons',
    prefix: 'pi',
    loader: async (iconName: string) => {
      try {
        const module = await import('react-icons/pi');
        return (module as any)[iconName] || null;
      } catch (error) {
        console.warn(`Failed to load Phosphor icon: ${iconName}`, error);
        return null;
      }
    },
  },

  // Remix Icon
  ri: {
    name: 'Remix Icon',
    prefix: 'ri',
    loader: async (iconName: string) => {
      try {
        const module = await import('react-icons/ri');
        return (module as any)[iconName] || null;
      } catch (error) {
        console.warn(`Failed to load Remix icon: ${iconName}`, error);
        return null;
      }
    },
  },

  // Simple Icons
  si: {
    name: 'Simple Icons',
    prefix: 'si',
    loader: async (iconName: string) => {
      try {
        const module = await import('react-icons/si');
        return (module as any)[iconName] || null;
      } catch (error) {
        console.warn(`Failed to load Simple icon: ${iconName}`, error);
        return null;
      }
    },
  },

  // Simple Line Icons
  sl: {
    name: 'Simple Line Icons',
    prefix: 'sl',
    loader: async (iconName: string) => {
      try {
        const module = await import('react-icons/sl');
        return (module as any)[iconName] || null;
      } catch (error) {
        console.warn(`Failed to load Simple Line icon: ${iconName}`, error);
        return null;
      }
    },
  },

  // Tabler Icons
  tb: {
    name: 'Tabler Icons',
    prefix: 'tb',
    loader: async (iconName: string) => {
      try {
        const module = await import('react-icons/tb');
        return (module as any)[iconName] || null;
      } catch (error) {
        console.warn(`Failed to load Tabler icon: ${iconName}`, error);
        return null;
      }
    },
  },

  // Typicons
  ti: {
    name: 'Typicons',
    prefix: 'ti',
    loader: async (iconName: string) => {
      try {
        const module = await import('react-icons/ti');
        return (module as any)[iconName] || null;
      } catch (error) {
        console.warn(`Failed to load Typicon: ${iconName}`, error);
        return null;
      }
    },
  },

  // VS Code Icons
  vs: {
    name: 'VS Code Icons',
    prefix: 'vs',
    loader: async (iconName: string) => {
      try {
        const module = await import('react-icons/vsc');
        return (module as any)[iconName] || null;
      } catch (error) {
        console.warn(`Failed to load VS Code icon: ${iconName}`, error);
        return null;
      }
    },
  },

  // Weather Icons
  wi: {
    name: 'Weather Icons',
    prefix: 'wi',
    loader: async (iconName: string) => {
      try {
        const module = await import('react-icons/wi');
        return (module as any)[iconName] || null;
      } catch (error) {
        console.warn(`Failed to load Weather icon: ${iconName}`, error);
        return null;
      }
    },
  },
};

/**
 * 根据前缀获取图标库配置
 */
export function getIconLibrary(prefix: IconPrefix): IconLibConfig | null {
  return ICON_LIBRARIES[prefix] || null;
}

/**
 * 解析图标名称
 */
export function parseIconName(name: string): { prefix: IconPrefix; iconName: string } | null {
  const parts = name.split(':');
  if (parts.length !== 2) {
    console.warn(`Invalid icon name format: ${name}. Expected format: "prefix:iconName"`);
    return null;
  }

  const [prefix, iconName] = parts;
  if (!ICON_LIBRARIES[prefix as IconPrefix]) {
    console.warn(`Unsupported icon library prefix: ${prefix}`);
    return null;
  }

  return {
    prefix: prefix as IconPrefix,
    iconName,
  };
}
