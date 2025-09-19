import React, { useState, useEffect } from 'react';
import { Icon } from '../../components/Icon';
import { ICON_LIBRARIES } from '../../utils/iconLibrary';
import { getIconNames, preloadIconNames } from '../../utils/iconNamesFetcher';
import { testLucideImport, testReactIconsImport } from '../../utils/testDynamicImport';
import './index.scss';

const IconDemo: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState<number>(24);
  const [selectedColor, setSelectedColor] = useState<string>('#333333');
  const [spin, setSpin] = useState(false);
  const [rotate, setRotate] = useState(0);
  const [selectedPrefix, setSelectedPrefix] = useState<string>('lr');
  const [iconName, setIconName] = useState<string>('Star');
  const [availableIcons, setAvailableIcons] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 获取当前前缀的图标名称
  const loadIconNames = async (prefix: string) => {
    setLoading(true);
    try {
      const icons = await getIconNames(prefix);
      setAvailableIcons(icons);

      // 如果当前图标名在新的图标列表中不存在，设置为第一个可用图标
      if (icons.length > 0 && !icons.includes(iconName)) {
        setIconName(icons[0]);
      }
    } catch (error) {
      console.error('Failed to load icon names:', error);
      setAvailableIcons([]);
    } finally {
      setLoading(false);
    }
  };

  // 处理前缀变化
  const handlePrefixChange = (newPrefix: string) => {
    setSelectedPrefix(newPrefix);
    loadIconNames(newPrefix);
  };

  // 组件初始化时预加载常用图标库
  useEffect(() => {
    // 测试动态导入
    testLucideImport();
    testReactIconsImport();

    preloadIconNames(['lr', 'md', 'bi', 'fa', 'hi', 'fi']);
    loadIconNames(selectedPrefix);
  }, []);

  const getCurrentIconName = () => `${selectedPrefix}:${iconName}`;

  // 示例图标
  const exampleIcons = [
    { name: 'lr:Users', description: 'Lucide React - 用户图标' },
    { name: 'lr:Home', description: 'Lucide React - 首页图标' },
    { name: 'lr:Settings', description: 'Lucide React - 设置图标' },
    { name: 'lr:Search', description: 'Lucide React - 搜索图标' },
    { name: 'lr:Bell', description: 'Lucide React - 通知图标' },
    { name: 'md:MdAccountCircle', description: 'Material Design - 账户图标' },
    { name: 'md:MdDashboard', description: 'Material Design - 仪表板图标' },
    { name: 'md:MdEmail', description: 'Material Design - 邮件图标' },
    { name: 'bi:BiUser', description: 'Bootstrap - 用户图标' },
    { name: 'bi:BiHeart', description: 'Bootstrap - 心形图标' },
    { name: 'fa:FaUser', description: 'Font Awesome - 用户图标' },
    { name: 'fa:FaHeart', description: 'Font Awesome - 心形图标' },
    { name: 'hi:HiUser', description: 'Heroicons - 用户图标' },
    { name: 'hi:HiHome', description: 'Heroicons - 首页图标' },
    { name: 'fi:FiUser', description: 'Feather - 用户图标' },
    { name: 'fi:FiHeart', description: 'Feather - 心形图标' },
  ];

  const sizes = [16, 20, 24, 32, 48, 64];
  const colors = ['#333333', '#007acc', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'];

  return (
    <div className="icon-demo">
      <div className="icon-demo__header">
        <h1>图标组件演示</h1>
        <p>支持多种图标库的统一图标组件，使用前缀区分不同的图标库</p>
      </div>

      <div className="icon-demo__content">
        {/* 控制面板 */}
        <section className="demo-section">
          <h2>控制面板</h2>
          <div className="controls-grid">
            <div className="control-group">
              <label>图标前缀：</label>
              <select value={selectedPrefix} onChange={(e) => handlePrefixChange(e.target.value)}>
                {Object.keys(ICON_LIBRARIES).map((prefix) => (
                  <option key={prefix} value={prefix}>
                    {prefix} - {ICON_LIBRARIES[prefix as keyof typeof ICON_LIBRARIES].name}
                  </option>
                ))}
              </select>
            </div>
            <div className="control-group">
              <label>选择图标：</label>
              <select
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                disabled={loading || availableIcons.length === 0}
                style={{ width: '100%' }}
              >
                <option value="">
                  {loading
                    ? '加载中...'
                    : availableIcons.length === 0
                      ? '无可用图标'
                      : `选择图标 (${availableIcons.length})`}
                </option>
                {availableIcons.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <div
                style={{
                  fontSize: '12px',
                  color: '#666',
                  marginTop: '4px',
                  fontFamily: 'monospace',
                }}
              >
                完整名称: <strong>{getCurrentIconName()}</strong>
                {availableIcons.length > 0 && (
                  <span style={{ marginLeft: '10px', color: '#999' }}>
                    共 {availableIcons.length} 个图标
                  </span>
                )}
              </div>
              {/* 调试信息 */}
              <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
                调试: prefix={selectedPrefix}, loading={loading.toString()}, icons=
                {availableIcons.length}
                <button
                  onClick={() => loadIconNames(selectedPrefix)}
                  style={{ marginLeft: '10px', fontSize: '11px', padding: '2px 6px' }}
                >
                  重新加载
                </button>
              </div>
            </div>{' '}
            <div className="control-group">
              <label>大小：</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(Number(e.target.value))}
              >
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}px
                  </option>
                ))}
              </select>
            </div>
            <div className="control-group">
              <label>颜色：</label>
              <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>
                {colors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
            <div className="control-group">
              <label>旋转角度：</label>
              <input
                type="range"
                min="0"
                max="360"
                value={rotate}
                onChange={(e) => setRotate(Number(e.target.value))}
              />
              <span>{rotate}°</span>
            </div>
            <div className="control-group">
              <label>
                <input type="checkbox" checked={spin} onChange={(e) => setSpin(e.target.checked)} />
                旋转动画
              </label>
            </div>
          </div>
        </section>

        {/* 图标浏览器 */}
        <section className="demo-section">
          <h2>图标浏览器</h2>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ marginBottom: '12px' }}>
              <strong>快速切换: </strong>
              {['lr', 'md', 'bi', 'fa', 'hi', 'fi'].map((prefix) => (
                <button
                  key={prefix}
                  onClick={() => setSelectedPrefix(prefix)}
                  style={{
                    margin: '0 4px 4px 0',
                    padding: '4px 8px',
                    fontSize: '12px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    background: selectedPrefix === prefix ? '#007acc' : 'white',
                    color: selectedPrefix === prefix ? 'white' : '#333',
                    cursor: 'pointer',
                  }}
                >
                  {prefix}
                </button>
              ))}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              当前库:{' '}
              <strong>{ICON_LIBRARIES[selectedPrefix as keyof typeof ICON_LIBRARIES]?.name}</strong>
              {loading && <span style={{ marginLeft: '10px' }}>⏳ 加载中...</span>}
            </div>
          </div>

          {availableIcons.length > 0 ? (
            <div className="icon-browser-grid">
              {availableIcons.map((name: string) => (
                <div
                  key={name}
                  className={`icon-browser-item ${iconName === name ? 'selected' : ''}`}
                  onClick={() => setIconName(name)}
                  title={`${selectedPrefix}:${name}`}
                >
                  <div className="icon-browser-preview">
                    <Icon name={`${selectedPrefix}:${name}`} size={20} />
                  </div>
                  <div className="icon-browser-name">{name}</div>
                </div>
              ))}
            </div>
          ) : (
            !loading && (
              <div
                style={{
                  padding: '40px',
                  textAlign: 'center',
                  color: '#999',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                }}
              >
                没有可用的图标
              </div>
            )
          )}
        </section>

        {/* 预览区域 */}
        <section className="demo-section">
          <h2>实时预览</h2>
          <div className="preview-area">
            <Icon
              name={getCurrentIconName()}
              size={selectedSize}
              color={selectedColor}
              style={{
                transform: `rotate(${rotate}deg)`,
                animation: spin ? 'spin 2s linear infinite' : 'none',
                transition: 'transform 0.3s ease',
              }}
            />
            <div className="preview-code">
              <code>
                {`<Icon 
  name="${getCurrentIconName()}"
  size={${selectedSize}}
  color="${selectedColor}"${
    rotate > 0
      ? `
  style={{ transform: 'rotate(${rotate}deg)' }}`
      : ''
  }${
    spin
      ? `
  style={{ animation: 'spin 2s linear infinite' }}`
      : ''
  }
/>`}
              </code>
            </div>
          </div>
        </section>

        {/* 图标库列表 */}
        <section className="demo-section">
          <h2>支持的图标库</h2>
          <div className="libraries-grid">
            {Object.values(ICON_LIBRARIES).map((lib) => (
              <div key={lib.prefix} className="library-card">
                <h3>{lib.name}</h3>
                <p>
                  前缀: <code>{lib.prefix}:</code>
                </p>
                <p>
                  示例: <code>{lib.prefix}:IconName</code>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 示例图标 */}
        <section className="demo-section">
          <h2>示例图标</h2>
          <div className="icons-grid">
            {exampleIcons.map(({ name, description }) => (
              <div key={name} className="icon-item">
                <div className="icon-preview">
                  <Icon name={name} size={24} />
                </div>
                <div className="icon-info">
                  <h4>{name}</h4>
                  <p>{description}</p>
                  <code>&lt;Icon name="{name}" /&gt;</code>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 使用示例 */}
        <section className="demo-section">
          <h2>使用示例</h2>
          <div className="examples-grid">
            <div className="example-card">
              <h3>基本使用</h3>
              <div className="example-demo">
                <Icon name="lr:Heart" />
                <Icon name="lr:Star" />
                <Icon name="lr:ThumbsUp" />
              </div>
              <code>&lt;Icon name="lr:Heart" /&gt;</code>
            </div>

            <div className="example-card">
              <h3>不同大小</h3>
              <div className="example-demo">
                <Icon name="md:MdFavorite" size={16} />
                <Icon name="md:MdFavorite" size={20} />
                <Icon name="md:MdFavorite" size={24} />
                <Icon name="md:MdFavorite" size={32} />
                <Icon name="md:MdFavorite" size={48} />
              </div>
              <code>&lt;Icon name="md:MdFavorite" size={24} /&gt;</code>
            </div>

            <div className="example-card">
              <h3>不同颜色</h3>
              <div className="example-demo">
                <Icon name="hi:HiHeart" color="#e74c3c" />
                <Icon name="hi:HiHeart" color="#007acc" />
                <Icon name="hi:HiHeart" color="#2ecc71" />
                <Icon name="hi:HiHeart" color="#f39c12" />
              </div>
              <code>&lt;Icon name="hi:HiHeart" color="#e74c3c" /&gt;</code>
            </div>

            <div className="example-card">
              <h3>动画效果</h3>
              <div className="example-demo">
                <Icon name="lr:RotateCw" style={{ animation: 'spin 2s linear infinite' }} />
                <Icon name="lr:Loader" style={{ animation: 'spin 1s linear infinite' }} />
                <Icon
                  name="lr:RefreshCw"
                  style={{
                    animation: 'spin 3s linear infinite',
                    animationDirection: 'reverse',
                  }}
                />
              </div>
              <code>
                {`<Icon 
  name="lr:RotateCw" 
  style={{ animation: 'spin 2s linear infinite' }} 
/>`}
              </code>
            </div>

            <div className="example-card">
              <h3>按钮中使用</h3>
              <div className="example-demo">
                <button className="demo-btn">
                  <Icon name="lr:Plus" size={16} />
                  添加
                </button>
                <button className="demo-btn">
                  <Icon name="lr:Download" size={16} />
                  下载
                </button>
              </div>
              <code>
                {`<button>
  <Icon name="lr:Plus" size={16} />
  添加
</button>`}
              </code>
            </div>
          </div>
        </section>

        {/* 错误处理演示 */}
        <section className="demo-section">
          <h2>错误处理</h2>
          <div className="error-examples">
            <div className="error-item">
              <h4>不存在的图标</h4>
              <Icon name="lr:NonExistentIcon" />
              <code>&lt;Icon name="lr:NonExistentIcon" /&gt;</code>
            </div>
            <div className="error-item">
              <h4>不支持的前缀</h4>
              <Icon name="xxx:SomeIcon" />
              <code>&lt;Icon name="xxx:SomeIcon" /&gt;</code>
            </div>
            <div className="error-item">
              <h4>格式错误</h4>
              <Icon name="InvalidFormat" />
              <code>&lt;Icon name="InvalidFormat" /&gt;</code>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default IconDemo;
