// 图标名称获取器 - 动态获取各个图标库的所有导出名称
/* @vite-ignore */
export interface IconNamesCache {
  [prefix: string]: string[];
}

// 缓存已获取的图标名称
const iconNamesCache: IconNamesCache = {};

// 专门的动态导入函数，使用具体的模块路径
const importModule = async (prefix: string): Promise<any> => {
  switch (prefix) {
    case 'lr':
      return await import(/* @vite-ignore */ 'lucide-react');
    case 'md':
      return await import(/* @vite-ignore */ 'react-icons/md');
    case 'ai':
      return await import(/* @vite-ignore */ 'react-icons/ai');
    case 'bi':
      return await import(/* @vite-ignore */ 'react-icons/bi');
    case 'ci':
      return await import(/* @vite-ignore */ 'react-icons/ci');
    case 'di':
      return await import(/* @vite-ignore */ 'react-icons/di');
    case 'fa':
      return await import(/* @vite-ignore */ 'react-icons/fa');
    case 'fc':
      return await import(/* @vite-ignore */ 'react-icons/fc');
    case 'fi':
      return await import(/* @vite-ignore */ 'react-icons/fi');
    case 'gi':
      return await import(/* @vite-ignore */ 'react-icons/gi');
    case 'go':
      return await import(/* @vite-ignore */ 'react-icons/go');
    case 'gr':
      return await import(/* @vite-ignore */ 'react-icons/gr');
    case 'hi':
      return await import(/* @vite-ignore */ 'react-icons/hi');
    case 'hi2':
      return await import(/* @vite-ignore */ 'react-icons/hi2');
    case 'im':
      return await import(/* @vite-ignore */ 'react-icons/im');
    case 'io':
      return await import(/* @vite-ignore */ 'react-icons/io');
    case 'io5':
      return await import(/* @vite-ignore */ 'react-icons/io5');
    case 'lia':
      return await import(/* @vite-ignore */ 'react-icons/lia');
    case 'pi':
      return await import(/* @vite-ignore */ 'react-icons/pi');
    case 'ri':
      return await import(/* @vite-ignore */ 'react-icons/ri');
    case 'si':
      return await import(/* @vite-ignore */ 'react-icons/si');
    case 'sl':
      return await import(/* @vite-ignore */ 'react-icons/sl');
    case 'tb':
      return await import(/* @vite-ignore */ 'react-icons/tb');
    case 'ti':
      return await import(/* @vite-ignore */ 'react-icons/ti');
    case 'vs':
      return await import(/* @vite-ignore */ 'react-icons/vsc');
    case 'wi':
      return await import(/* @vite-ignore */ 'react-icons/wi');
    default:
      throw new Error(`Unknown prefix: ${prefix}`);
  }
};

// 获取模块的所有导出名称（仅React组件）
const getModuleExports = async (prefix: string): Promise<string[]> => {
  try {
    console.log(`Loading module for prefix: ${prefix}`);
    const module = await importModule(prefix);
    console.log(`Module loaded successfully for prefix: ${prefix}`);
    console.log('Module object:', module);

    const exports = Object.keys(module);
    console.log(`Module exports count: ${exports.length} for ${prefix}`);
    console.log('All exports:', exports.slice(0, 20)); // 显示前20个导出

    // 过滤出可能是React组件的导出（首字母大写）
    const componentExports = exports.filter((name) => {
      // 排除一些非组件的导出
      if (name === 'default' || name === '__esModule') return false;

      // 检查是否以大写字母开头（React组件约定）
      return /^[A-Z]/.test(name);
    });

    console.log(`Component exports count: ${componentExports.length} for ${prefix}`);
    console.log(`First 10 component exports: ${componentExports.slice(0, 10).join(', ')}`);
    return componentExports.sort();
  } catch (error) {
    console.error(`Failed to load module for prefix ${prefix}:`, error);
    return [];
  }
};

// 静态图标名称 - 作为动态加载失败时的备选方案
const staticIconNames: IconNamesCache = {
  lr: [
    'Star',
    'Heart',
    'User',
    'Home',
    'Settings',
    'Search',
    'Bell',
    'Mail',
    'Phone',
    'Calendar',
    'Clock',
    'Download',
    'Upload',
    'Edit',
    'Delete',
    'Plus',
    'Minus',
    'Check',
    'X',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'ChevronLeft',
    'ChevronRight',
    'ChevronUp',
    'ChevronDown',
    'Menu',
    'MoreHorizontal',
    'MoreVertical',
    'Eye',
    'EyeOff',
    'Lock',
    'Unlock',
    'Key',
    'Shield',
    'AlertCircle',
    'AlertTriangle',
    'Info',
    'CheckCircle',
    'XCircle',
    'HelpCircle',
    'Zap',
    'Activity',
    'BarChart',
    'PieChart',
    'TrendingUp',
    'TrendingDown',
    'Database',
    'Server',
    'Cloud',
    'Wifi',
    'Bluetooth',
    'Battery',
    'Volume',
    'Play',
    'Pause',
    'Stop',
    'SkipForward',
    'SkipBack',
    'FastForward',
    'Rewind',
    'Repeat',
    'Shuffle',
    'Camera',
    'Image',
    'Video',
    'Mic',
    'MicOff',
    'Headphones',
    'Music',
    'File',
    'FileText',
    'Folder',
    'FolderOpen',
    'Save',
    'Copy',
    'Cut',
    'Clipboard',
    'Link',
    'ExternalLink',
    'Share',
    'MessageCircle',
    'Send',
    'Inbox',
    'Archive',
    'Trash',
    'Bookmark',
    'Flag',
    'Tag',
    'Filter',
    'Sort',
    'Grid',
    'List',
    'Layout',
    'Sidebar',
    'Maximize',
    'Minimize',
    'Refresh',
    'RotateCw',
    'RotateCcw',
    'Undo',
    'Redo',
    'Coffee',
    'Sun',
    'Moon',
    'CloudRain',
    'CloudSnow',
    'Thermometer',
    'Droplets',
    'Wind',
    'MapPin',
    'Navigation',
    'Compass',
    'Map',
    'Globe',
    'Plane',
    'Car',
    'Truck',
    'Bike',
    'Train',
    'Ship',
    'Anchor',
    'Award',
    'Target',
    'Gift',
  ],
  md: [
    'MdHome',
    'MdPerson',
    'MdSettings',
    'MdSearch',
    'MdNotifications',
    'MdEmail',
    'MdPhone',
    'MdCalendarToday',
    'MdAccessTime',
    'MdDownload',
    'MdUpload',
    'MdEdit',
    'MdDelete',
    'MdAdd',
    'MdRemove',
    'MdCheck',
    'MdClose',
    'MdArrowBack',
    'MdArrowForward',
    'MdArrowUpward',
    'MdArrowDownward',
    'MdChevronLeft',
    'MdChevronRight',
    'MdExpandLess',
    'MdExpandMore',
    'MdMenu',
    'MdMoreHoriz',
    'MdMoreVert',
    'MdVisibility',
    'MdVisibilityOff',
    'MdLock',
    'MdLockOpen',
    'MdVpnKey',
    'MdSecurity',
    'MdError',
    'MdWarning',
    'MdInfo',
    'MdCheckCircle',
    'MdCancel',
    'MdHelp',
  ],
  bi: [
    'BiUser',
    'BiHome',
    'BiCog',
    'BiSearch',
    'BiBell',
    'BiEnvelope',
    'BiPhone',
    'BiCalendar',
    'BiTime',
    'BiDownload',
    'BiUpload',
    'BiEdit',
    'BiTrash',
    'BiPlus',
    'BiMinus',
    'BiCheck',
    'BiX',
    'BiChevronLeft',
    'BiChevronRight',
    'BiChevronUp',
    'BiChevronDown',
    'BiMenu',
    'BiDotsHorizontalRounded',
    'BiDotsVerticalRounded',
    'BiShow',
    'BiHide',
    'BiLock',
    'BiLockOpen',
  ],
  fa: [
    'FaUser',
    'FaHome',
    'FaCog',
    'FaSearch',
    'FaBell',
    'FaEnvelope',
    'FaPhone',
    'FaCalendar',
    'FaClock',
    'FaDownload',
    'FaUpload',
    'FaEdit',
    'FaTrash',
    'FaPlus',
    'FaMinus',
    'FaCheck',
    'FaTimes',
    'FaChevronLeft',
    'FaChevronRight',
    'FaChevronUp',
    'FaChevronDown',
    'FaBars',
    'FaEllipsisH',
    'FaEllipsisV',
    'FaEye',
    'FaEyeSlash',
    'FaLock',
    'FaUnlock',
  ],
  hi: [
    'HiUser',
    'HiHome',
    'HiCog',
    'HiSearch',
    'HiBell',
    'HiMail',
    'HiPhone',
    'HiCalendar',
    'HiClock',
    'HiDownload',
    'HiUpload',
    'HiPencil',
    'HiTrash',
    'HiPlus',
    'HiMinus',
    'HiCheck',
    'HiX',
    'HiChevronLeft',
    'HiChevronRight',
    'HiChevronUp',
    'HiChevronDown',
    'HiMenu',
    'HiDotsHorizontal',
    'HiDotsVertical',
    'HiEye',
    'HiEyeOff',
    'HiLockClosed',
    'HiLockOpen',
  ],
  fi: [
    'FiUser',
    'FiHome',
    'FiSettings',
    'FiSearch',
    'FiBell',
    'FiMail',
    'FiPhone',
    'FiCalendar',
    'FiClock',
    'FiDownload',
    'FiUpload',
    'FiEdit',
    'FiTrash',
    'FiPlus',
    'FiMinus',
    'FiCheck',
    'FiX',
    'FiChevronLeft',
    'FiChevronRight',
    'FiChevronUp',
    'FiChevronDown',
    'FiMenu',
    'FiMoreHorizontal',
    'FiMoreVertical',
    'FiEye',
    'FiEyeOff',
    'FiLock',
    'FiUnlock',
  ],
};

// 获取特定前缀的图标名称
export const getIconNames = async (prefix: string): Promise<string[]> => {
  console.log(`Getting icon names for prefix: ${prefix}`);

  // 如果已缓存，直接返回
  if (iconNamesCache[prefix]) {
    console.log(`Returning cached icons for ${prefix}: ${iconNamesCache[prefix].length} icons`);
    return iconNamesCache[prefix];
  }

  let iconNames: string[] = [];

  try {
    // 首先尝试动态加载，使用专门的导入函数
    iconNames = await getModuleExports(prefix);

    // 如果动态加载失败或返回空数组，使用静态备选方案
    if (iconNames.length === 0 && staticIconNames[prefix]) {
      console.log(`Dynamic loading failed for ${prefix}, using static fallback`);
      iconNames = staticIconNames[prefix];
    }

    // 缓存结果
    iconNamesCache[prefix] = iconNames;
    console.log(`Cached ${iconNames.length} icons for prefix ${prefix}`);
  } catch (error) {
    console.error(`Error fetching icon names for prefix ${prefix}:`, error);
    // 使用静态备选方案
    if (staticIconNames[prefix]) {
      console.log(`Using static fallback for ${prefix} due to error`);
      iconNames = staticIconNames[prefix];
      iconNamesCache[prefix] = iconNames;
    } else {
      iconNames = [];
    }
  }

  return iconNames;
};

// 预加载常用图标库的名称
export const preloadIconNames = async (
  prefixes: string[] = ['lr', 'md', 'bi', 'fa', 'hi', 'fi']
) => {
  const promises = prefixes.map((prefix) => getIconNames(prefix));
  await Promise.allSettled(promises);
};

// 清除缓存
export const clearIconNamesCache = () => {
  Object.keys(iconNamesCache).forEach((key) => {
    delete iconNamesCache[key];
  });
};

// 获取所有已缓存的图标名称
export const getAllCachedIconNames = (): IconNamesCache => {
  return { ...iconNamesCache };
};
