import React from 'react';
import { ExternalLink, Video, Github, PlayCircle } from 'lucide-react';

const Navigation = () => {
  const links = [
    {
      href: "https://www.bilibili.com/video/BV1mCkEYyEcy/",
      text: "视频教程",
      icon: <Video className="w-4 h-4" />
    },
    {
      href: "https://qwenlm.github.io/zh/blog/qwen2.5-coder-family/",
      text: "免费GPU云电脑",
      icon: <ExternalLink className="w-4 h-4" />
    },
    {
      href: "https://github.com/aigem/videos",
      text: "GitHub",
      icon: <Github className="w-4 h-4" />
    },
    {
      href: "https://space.bilibili.com/3493076850968674",
      text: "更多视频",
      icon: <PlayCircle className="w-4 h-4" />
    },
    {
      href: "https://qr61.cn/oohivs/qRp62U6",
      text: "加入交流群",
      icon: <PlayCircle className="w-4 h-4" />
    },
    {
      href: "https://gf.bilibili.com/item/detail/1107198073",
      text: "获取一键安装脚本",
      icon: <PlayCircle className="w-4 h-4" />
    }
  ];

  return (
    <nav className="bg-purple-700 w-full px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-6">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white hover:text-purple-200 transition-colors duration-200"
          >
            {link.icon}
            <span>{link.text}</span>
          </a>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;