interface FooterLink {
  name: string;
  href: string;
}

interface FooterLinkListProps {
  title: string;
  links: FooterLink[];
  className?: string;
}

export default function FooterLinkList({
  title,
  links,
  className = "",
}: FooterLinkListProps) {
  return (
    <nav
      className={`inline-flex w-44 flex-col items-center justify-start gap-5 lg:items-start ${className}`}
    >
      <h3 className="justify-center self-stretch text-center text-[10px] leading-none font-bold tracking-wider text-(--color-father) uppercase lg:justify-start lg:text-left">
        {title}
      </h3>
      <ul className="m-0 flex list-none flex-col items-center justify-start gap-5 self-stretch p-0 lg:items-start">
        {links.map((link, index) => (
          <li key={index}>
            <a
              href={link.href}
              className="cursor-pointer justify-center text-center text-base leading-loose font-normal text-(--color-father) transition-opacity hover:opacity-80 lg:justify-start lg:text-left"
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
