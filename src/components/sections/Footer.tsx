import { siteConfig } from "@/content/site";

export function Footer() {
  return (
    <footer>
      <p>{siteConfig.name}</p>
      <ul>
        {siteConfig.contacts.map((contact) => (
          <li key={contact.kind}>
            <a href={contact.href}>{contact.label}</a>
          </li>
        ))}
      </ul>
    </footer>
  );
}

