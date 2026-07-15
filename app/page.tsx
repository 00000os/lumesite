const categories = [
  {
    slug: "moda",
    title: "Moda feminina",
    description: "Peças que valorizam sua beleza e traduzem seu estilo.",
    className: "category-fashion",
    tag: "Vista sua melhor versão",
  },
  {
    slug: "personalizados",
    title: "Presentes personalizados",
    description: "Detalhes únicos para celebrar histórias que importam.",
    className: "category-personalized",
    tag: "Feito com afeto",
  },
  {
    slug: "cosmeticos",
    title: "Cosméticos",
    description: "Beleza, cuidado e bem-estar para todos os seus dias.",
    className: "category-beauty",
    tag: "Seu ritual, seu momento",
  },
  {
    slug: "kits",
    title: "Kits para presentear",
    description: "Composições prontas para tornar cada ocasião inesquecível.",
    className: "category-gifts",
    tag: "Carinho em cada detalhe",
  },
];

const benefits = [
  { icon: "seal", title: "Curadoria especial", text: "Qualidade que você confia" },
  { icon: "gem", title: "Produtos selecionados", text: "Escolhidos com carinho" },
  { icon: "heart", title: "Atendimento próximo", text: "Uma experiência que acolhe" },
  { icon: "gift", title: "Presentes únicos", text: "Detalhes que criam memórias" },
  { icon: "bag", title: "Tudo em um só lugar", text: "Moda, beleza e afeto" },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Lume - início">
          <span className="brand-mark">L</span>
          <span className="brand-copy">
            <strong>LUME</strong>
            <small>moda · presentes · personalizados</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Navegação principal">
          <a href="#colecoes">Coleções</a>
          <a href="#experiencia">Experiência</a>
          <a href="#visite">Visite-nos</a>
        </nav>

        <a className="header-cta" href="#visite">Quero conhecer</a>

        <details className="mobile-menu">
          <summary aria-label="Abrir menu">Menu</summary>
          <nav aria-label="Navegação mobile">
            <a href="#colecoes">Coleções</a>
            <a href="#experiencia">Experiência</a>
            <a href="#visite">Visite-nos</a>
          </nav>
        </details>
      </header>

      <section className="hero" id="inicio" aria-labelledby="hero-title">
        <div className="hero-image" aria-hidden="true" />
        <div className="hero-overlay" />
        <div className="hero-frame" aria-hidden="true" />
        <div className="hero-content">
          <p className="eyebrow"><span /> Um novo conceito em boutique</p>
          <h1 id="hero-title">Tudo o que você ama, <em>em um só lugar.</em></h1>
          <p className="hero-lead">
            Moda, beleza e presentes pensados para transformar pequenos gestos em
            experiências inesquecíveis.
          </p>
          <div className="hero-actions">
            <a className="button button-gold" href="#colecoes">Descubra a Lume</a>
            <a className="text-link" href="#visite">Venha nos visitar <span>↗</span></a>
          </div>
          <div className="hero-mini-list" aria-label="Categorias da loja">
            <span>Moda</span><i />
            <span>Presentes</span><i />
            <span>Cosméticos</span><i />
            <span>Personalizados</span>
          </div>
        </div>
        <div className="hero-seal" aria-label="Feito para você e para quem você ama">
          <span>feito para</span><strong>você</strong><span>& quem você ama</span><b>♡</b>
        </div>
      </section>

      <section className="intro" id="colecoes">
        <p className="script-title">Mais que uma loja, uma experiência completa.</p>
        <div className="section-heading">
          <div>
            <p className="eyebrow dark"><span /> Curadoria Lume</p>
            <h2>Escolha o detalhe que<br />vai iluminar o seu dia.</h2>
          </div>
          <p>
            Reunimos peças, aromas e presentes que falam sobre beleza, cuidado e
            afeto — do seu jeito e para cada momento.
          </p>
        </div>

        <div className="category-grid">
          {categories.map((category, index) => (
            <article className={`category-card ${category.className}`} key={category.title}>
              <div className="category-copy">
                <span className="category-number">0{index + 1}</span>
                <h3>{category.title}</h3>
                <p>{category.description}</p>
              </div>
              <div className="category-photo" role="img" aria-label={category.title}>
                <span>{category.tag}</span>
              </div>
              <a href={`/loja/${category.slug}`} aria-label={`Conhecer ${category.title}`}>Ver produtos <span>↗</span></a>
            </article>
          ))}
        </div>
      </section>

      <section className="experience" id="experiencia">
        <div className="experience-heading">
          <p className="eyebrow"><span /> A experiência Lume</p>
          <h2>Estilo que veste.<br /><em>Detalhes que encantam.</em></h2>
        </div>
        <div className="benefit-grid">
          {benefits.map((benefit) => (
            <article className="benefit" key={benefit.title}>
              <div className={`benefit-icon benefit-icon-${benefit.icon}`} aria-hidden="true">
                <span className="icon-art"><i /><i /><i /></span>
              </div>
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="visit" id="visite">
        <div className="visit-copy">
          <p className="eyebrow dark"><span /> Seu momento começa aqui</p>
          <h2>Vista sua melhor versão.<br /><em>Presenteie com significado.</em></h2>
          <p>
            Venha descobrir uma seleção feita para você — e para quem você ama.
            Será um prazer receber você na Lume.
          </p>
          <div className="visit-actions">
            <a
              className="button button-dark"
              href="https://wa.me/?text=Olá%2C%20Lume!%20Gostaria%20de%20conhecer%20os%20produtos."
              target="_blank"
              rel="noreferrer"
            >
              Chamar no WhatsApp
            </a>
            <a className="text-link dark-link" href="#inicio">Voltar ao início ↑</a>
          </div>
        </div>
        <div className="visit-card">
          <span className="visit-pin">⌖</span>
          <p>Venha nos visitar</p>
          <strong>Esperamos<br />por você!</strong>
          <span className="visit-heart">♡</span>
        </div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#inicio">
          <span className="brand-mark">L</span>
          <span className="brand-copy"><strong>LUME</strong><small>moda · beleza · presentes</small></span>
        </a>
        <p>Elegância para viver. Carinho para presentear.</p>
        <p className="copyright">© 2026 Lume Boutique</p>
      </footer>
    </main>
  );
}
