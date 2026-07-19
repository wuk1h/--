'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Images, Menu, NotebookTabs, Users, X } from 'lucide-react';

const navItems = [
  { href: '/characters/', label: '角色', icon: Users },
  { href: '/volumes/', label: '卷宗', icon: NotebookTabs },
  { href: '/gallery/', label: '插画', icon: Images },
];

export function ArchiveHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" href="/" aria-label="败犬青春档案首页">
          <span className="brand__mark" aria-hidden="true">M</span>
          <span>
            <strong>败犬青春档案</strong>
            <small>MAKEINE ARCHIVE</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="主导航">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link href={href} key={href} aria-current={active ? 'page' : undefined}>
                <Icon aria-hidden="true" size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        <button
          className="icon-button mobile-menu-button"
          type="button"
          aria-label={open ? '关闭菜单' : '打开菜单'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <nav className="mobile-nav" aria-label="移动端导航">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link href={href} key={href}>
              <Icon aria-hidden="true" size={18} />
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
