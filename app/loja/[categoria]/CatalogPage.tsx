"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { categories, formatCurrency, imagePositions, type Category, type Product } from "../catalog-data";
import styles from "./catalog.module.css";

type SortOption = "featured" | "low" | "high" | "name";
const clothingSizes = ["P", "M", "G", "GG", "XG", "48–52"];
const cosmeticBrands = ["Natura", "Mary Kay"];
const kitOccasions = ["Aniversário", "Dia das Mães", "Romântico", "Amizade", "Casamento", "Agradecimento"];
const colorSwatches: Record<string, string> = {
  Marfim: "#eee3cf",
  Rosé: "#c98f8d",
  Preto: "#171411",
  Areia: "#cbb99e",
  Marrom: "#684936",
  Nude: "#c9a18b",
  Bege: "#d8c7ad",
  Caramelo: "#a96f3f",
  "Off-white": "#f5f0e6",
  Branco: "#faf7f0",
  Natural: "#d8c8ad",
  "Preto e dourado": "linear-gradient(135deg, #171411 50%, #bd8b49 50%)",
  "Rosé e marfim": "linear-gradient(135deg, #c98f8d 50%, #eee3cf 50%)",
  "Kraft e cetim": "linear-gradient(135deg, #ad805c 50%, #d8b68c 50%)",
};

type CartLine = {
  productId: string;
  productName: string;
  price: number;
  sheet: string;
  imageIndex: number;
  categorySlug: string;
  quantity: number;
  size?: string;
  color?: string;
  note?: string;
};

export default function CatalogPage({ initialCategory, initialProductId }: { initialCategory: Category; initialProductId?: string }) {
  const initialProduct = initialProductId ? initialCategory.products.find((product) => product.id === initialProductId) || null : null;
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("featured");
  const [price, setPrice] = useState("all");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<Record<string, CartLine>>({});
  const [cartReady, setCartReady] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(initialProduct);
  const [productSize, setProductSize] = useState(initialProduct?.sizes?.[0] || "");
  const [productColor, setProductColor] = useState(initialProduct?.colors?.[0] || "");
  const [productQuantity, setProductQuantity] = useState(1);
  const [productNote, setProductNote] = useState("");
  const [galleryView, setGalleryView] = useState(0);
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [cep, setCep] = useState("");
  const [shipping, setShipping] = useState<{ price: number; label: string } | null>(null);
  const [payment, setPayment] = useState("Pix");

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedProduct(null);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    try {
      const savedCart = window.localStorage.getItem("lume-cart-v2");
      const savedFavorites = window.localStorage.getItem("lume-favorites-v1");
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    } catch { /* dados antigos inválidos são ignorados */ }
    setCartReady(true);
  }, []);

  useEffect(() => {
    if (!cartReady) return;
    window.localStorage.setItem("lume-cart-v2", JSON.stringify(cart));
    window.localStorage.setItem("lume-favorites-v1", JSON.stringify(favorites));
  }, [cart, cartReady, favorites]);

  const catalogProducts = initialCategory.products;

  const products = useMemo(() => {
    const aliases = initialCategory.slug === "moda" ? "roupa feminino plus size look blusa calça vestido" : initialCategory.slug === "cosmeticos" ? "beleza perfume maquiagem natura mary kay skincare" : initialCategory.slug === "kits" ? "presente mãe aniversário casamento romântico" : "presente personalizado nome frase lembrança";
    let result = catalogProducts.filter((product) =>
      `${product.name} ${product.description} ${product.brand || ""} ${(product.occasions || []).join(" ")} ${aliases}`.toLowerCase().includes(query.toLowerCase()),
    );
    if (price === "under100") result = result.filter((product) => product.price < 100);
    if (price === "100to200") result = result.filter((product) => product.price >= 100 && product.price <= 200);
    if (price === "over200") result = result.filter((product) => product.price > 200);
    if (selectedSizes.length) result = result.filter((product) => product.sizes?.some((size) => selectedSizes.includes(size)));
    if (selectedBrands.length) result = result.filter((product) => product.brand && selectedBrands.includes(product.brand));
    if (selectedOccasions.length) result = result.filter((product) => product.occasions?.some((occasion) => selectedOccasions.includes(occasion)));
    return [...result].sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      if (sort === "name") return a.name.localeCompare(b.name);
      return a.imageIndex - b.imageIndex;
    });
  }, [catalogProducts, initialCategory.slug, price, query, selectedBrands, selectedOccasions, selectedSizes, sort]);

  const cartLines = Object.entries(cart);
  const itemCount = cartLines.reduce((total, [, line]) => total + line.quantity, 0);
  const cartTotal = cartLines.reduce((total, [, line]) => total + line.price * line.quantity, 0);
  const discount = coupon === "LUME10" ? cartTotal * .1 : coupon === "PIX5" ? cartTotal * .05 : 0;
  const orderTotal = Math.max(0, cartTotal - discount) + (shipping?.price || 0);

  function addToCart(product: Product, options?: { size?: string; color?: string; quantity?: number; note?: string }) {
    const quantity = options?.quantity || 1;
    const key = [product.id, options?.size || "", options?.color || "", options?.note || ""].join("|");
    setCart((current) => ({
      ...current,
      [key]: {
        productId: product.id,
        productName: product.name,
        price: product.price,
        sheet: initialCategory.sheet,
        imageIndex: product.imageIndex,
        categorySlug: initialCategory.slug,
        size: options?.size,
        color: options?.color,
        note: options?.note,
        quantity: (current[key]?.quantity || 0) + quantity,
      },
    }));
    setSelectedProduct(null);
    setCartOpen(true);
  }

  function updateQuantity(lineKey: string, amount: number) {
    setCart((current) => {
      const line = current[lineKey];
      if (!line) return current;
      const next = Math.max(0, line.quantity + amount);
      const updated = { ...current, [lineKey]: { ...line, quantity: next } };
      if (!next) delete updated[lineKey];
      return updated;
    });
  }

  function openProduct(product: Product) {
    setProductSize(product.sizes?.[0] || "");
    setProductColor(product.colors?.[0] || "");
    setProductQuantity(1);
    setProductNote("");
    setGalleryView(0);
    setSelectedProduct(product);
  }

  function toggleFavorite(productId: string) {
    setFavorites((current) =>
      current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId],
    );
  }

  function toggleSize(size: string) {
    setSelectedSizes((current) =>
      current.includes(size) ? current.filter((item) => item !== size) : [...current, size],
    );
  }

  function toggleListValue(value: string, setter: Dispatch<SetStateAction<string[]>>) {
    setter((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  }

  function actionLabel() {
    if (initialCategory.slug === "personalizados") return "Personalizar";
    if (initialCategory.slug === "kits") return "Montar meu kit";
    return "Ver opções";
  }

  function sendOrder() {
    const lines = cartLines.map(([, line]) => {
      const colorLabel = line.categorySlug === "kits" ? "Embalagem" : "Cor";
      const options = [line.color && `${colorLabel}: ${line.color}`, line.size && `Tam: ${line.size}`, line.note && `Mensagem: ${line.note}`].filter(Boolean).join(" · ");
      return `${line.quantity}x ${line.productName}${options ? ` (${options})` : ""} — ${formatCurrency(line.price * line.quantity)}`;
    });
    const summary = [coupon && `Cupom: ${coupon}`, shipping && `Entrega: ${shipping.label} (${formatCurrency(shipping.price)})`, `Pagamento preferido: ${payment}`, `Total: ${formatCurrency(orderTotal)}`].filter(Boolean) as string[];
    const message = ["Olá, Lume! Gostaria de pedir:", ...lines, ...summary].join("\n");
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  function applyCoupon() {
    const normalized = couponInput.trim().toUpperCase();
    if (normalized === "LUME10" || normalized === "PIX5") {
      setCoupon(normalized);
      setCouponMessage(normalized === "LUME10" ? "10% de desconto aplicado." : "5% de desconto aplicado.");
    } else {
      setCoupon("");
      setCouponMessage("Cupom não encontrado.");
    }
  }

  function calculateShipping() {
    const numbers = cep.replace(/\D/g, "");
    if (numbers.length !== 8) {
      setShipping({ price: 0, label: "Digite um CEP válido" });
      return;
    }
    const region = Number(numbers[0]);
    setShipping({ price: 0, label: `CEP ${numbers.slice(0, 5)}-${numbers.slice(5)} registrado · valor confirmado no atendimento` });
  }

  return (
    <main className={styles.storePage}>
      <div className={styles.topNote}>Compra segura · Atendimento personalizado · Retirada na loja</div>
      <header className={styles.storeHeader}>
        <Link className={styles.brand} href="/" aria-label="Lume - voltar para a página inicial">
          <span className={styles.brandMark}>L</span>
          <span><strong>LUME</strong><small>moda · beleza · presentes</small></span>
        </Link>
        <label className={styles.search}>
          <span aria-hidden="true">⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="O que você procura?" aria-label="Buscar produtos" />
        </label>
        <div className={styles.headerActions}>
          <Link href="/">Início</Link>
          <button type="button" onClick={() => setCartOpen(true)} aria-label={`Abrir carrinho com ${itemCount} itens`}>
            Sacola <b>{itemCount}</b>
          </button>
        </div>
      </header>

      <nav className={styles.categoryNav} aria-label="Categorias da loja">
        {categories.map((category) => (
          <Link className={category.slug === initialCategory.slug ? styles.activeCategory : ""} href={`/loja/${category.slug}`} key={category.slug}>
            {category.name}
          </Link>
        ))}
      </nav>

      <section className={styles.catalogHero}>
        <div>
          <p><Link href="/">Início</Link><span>/</span>Loja<span>/</span>{initialCategory.name}</p>
          <span className={styles.eyebrow}>{initialCategory.eyebrow}</span>
          <h1>{initialCategory.name}</h1>
          <div className={styles.goldLine} />
          <p className={styles.categoryDescription}>{initialCategory.description}</p>
        </div>
        <div className={styles.heroCount}><strong>{initialCategory.products.length}</strong><span>produtos<br />selecionados</span></div>
      </section>

      <section className={styles.catalogBody}>
        <button className={styles.mobileFilterButton} type="button" onClick={() => setFiltersOpen((value) => !value)}>
          {filtersOpen ? "Fechar filtros" : "Filtrar produtos"}
        </button>
        <aside className={`${styles.filters} ${filtersOpen ? styles.filtersOpen : ""}`}>
          <div className={styles.filterTitle}><strong>Filtros</strong><button type="button" onClick={() => { setPrice("all"); setQuery(""); setSelectedSizes([]); setSelectedBrands([]); setSelectedOccasions([]); }}>Limpar</button></div>
          <fieldset>
            <legend>Faixa de preço</legend>
            {[
              ["all", "Todos os preços"],
              ["under100", "Até R$ 99"],
              ["100to200", "R$ 100 a R$ 200"],
              ["over200", "Acima de R$ 200"],
            ].map(([value, label]) => (
              <label key={value}><input type="radio" name="price" value={value} checked={price === value} onChange={() => setPrice(value)} /><span>{label}</span></label>
            ))}
          </fieldset>
          {initialCategory.slug === "moda" && (
            <fieldset className={styles.sizeFilter}>
              <legend>Tamanho</legend>
              <p>Selecione um ou mais tamanhos</p>
              <div>
                {clothingSizes.map((size) => (
                  <label className={selectedSizes.includes(size) ? styles.sizeSelected : ""} key={size}>
                    <input type="checkbox" checked={selectedSizes.includes(size)} onChange={() => toggleSize(size)} />
                    <span>{size === "48–52" ? "Plus 48–52" : size}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          {initialCategory.slug === "cosmeticos" && (
            <fieldset className={styles.choiceFilter}>
              <legend>Escolha sua marca</legend>
              <p>Veja Natura, Mary Kay ou as duas</p>
              <div>
                {cosmeticBrands.map((brand) => (
                  <label className={selectedBrands.includes(brand) ? styles.choiceSelected : ""} key={brand}>
                    <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleListValue(brand, setSelectedBrands)} />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          {initialCategory.slug === "kits" && (
            <fieldset className={styles.choiceFilter}>
              <legend>Para qual ocasião?</legend>
              <p>Encontre o presente ideal</p>
              <div>
                {kitOccasions.map((occasion) => (
                  <label className={selectedOccasions.includes(occasion) ? styles.choiceSelected : ""} key={occasion}>
                    <input type="checkbox" checked={selectedOccasions.includes(occasion)} onChange={() => toggleListValue(occasion, setSelectedOccasions)} />
                    <span>{occasion}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          <div className={styles.storePromise}>
            <span aria-hidden="true">♡</span>
            <strong>{initialCategory.slug === "kits" ? "Pronto para emocionar" : "Escolhido com carinho"}</strong>
            <p>{initialCategory.slug === "kits" ? "Embalagem especial e cartão personalizado inclusos." : "Cada produto passa pela curadoria da Lume."}</p>
          </div>
        </aside>

        <div className={styles.productsArea}>
          <div className={styles.productToolbar}>
            <p><strong>{products.length}</strong> produtos encontrados</p>
            <label>Ordenar por
              <select value={sort} onChange={(event) => setSort(event.target.value as SortOption)}>
                <option value="featured">Destaques</option>
                <option value="low">Menor preço</option>
                <option value="high">Maior preço</option>
                <option value="name">Nome A–Z</option>
              </select>
            </label>
          </div>

          {products.length ? (
            <div className={styles.productGrid}>
              {products.map((product) => (
                <article className={styles.productCard} key={product.id}>
                  <div
                    className={styles.productImage}
                    style={{ backgroundImage: `url(${initialCategory.sheet})`, backgroundPosition: imagePositions[product.imageIndex] }}
                    role="img"
                    aria-label={product.name}
                  >
                    <Link className={styles.productOpen} href={`/loja/${initialCategory.slug}/produto/${product.id}`} aria-label={`Ver detalhes de ${product.name}`} />
                    {product.badge && <span className={styles.badge}>{product.badge}</span>}
                    <button className={`${styles.favorite} ${favorites.includes(product.id) ? styles.favoriteActive : ""}`} type="button" onClick={() => toggleFavorite(product.id)} aria-label={`Favoritar ${product.name}`}>
                      {favorites.includes(product.id) ? "♥" : "♡"}
                    </button>
                  </div>
                  <div className={styles.productInfo}>
                    {product.brand && <span className={styles.brandPill}>{product.brand}</span>}
                    <p>{product.description}</p>
                    <h2><Link href={`/loja/${initialCategory.slug}/produto/${product.id}`}>{product.name}</Link></h2>
                    {product.sizes && (
                      <div className={styles.productSizes}>
                        <span>Tamanhos</span>
                        <div>{product.sizes.map((size) => <b key={size}>{size}</b>)}</div>
                      </div>
                    )}
                    {product.occasions && <div className={styles.productOccasions}>{product.occasions.map((occasion) => <span key={occasion}>{occasion}</span>)}</div>}
                    {product.oldPrice && <del>{formatCurrency(product.oldPrice)}</del>}
                    <strong>{formatCurrency(product.price)}</strong>
                    <small>{product.installment} sem juros</small>
                    <span className={styles.stockNote}>{typeof product.stock === "number" ? (product.stock <= 3 ? `Últimas ${product.stock} unidades` : `${product.stock} unidades disponíveis`) : "Disponibilidade sob consulta"}</span>
                    <Link className={styles.productCta} href={`/loja/${initialCategory.slug}/produto/${product.id}`}>{initialCategory.slug === "cosmeticos" ? "Ver produto" : actionLabel()}</Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}><span>◇</span><h2>Nenhum produto encontrado</h2><p>Tente buscar outro nome ou limpar os filtros.</p></div>
          )}
        </div>
      </section>

      <footer className={styles.storeFooter}>
        <div><strong>LUME</strong><p>Elegância para viver. Carinho para presentear.</p><small>Atendimento online · Retirada combinada · Envio para todo o Brasil</small></div>
        <div className={styles.footerLinks}><span>Atendimento</span><a href="https://wa.me/?text=Olá%2C%20Lume!" target="_blank" rel="noreferrer">WhatsApp</a><Link href="/politicas#trocas">Trocas e devoluções</Link><Link href="/politicas#privacidade">Privacidade</Link></div>
        <div className={styles.footerLinks}><span>Compra segura</span><small>Pix · Cartão · Dinheiro</small><small>Segunda a sábado</small><Link href="/">Página inicial</Link></div>
      </footer>

      {selectedProduct && (
        <>
          <button className={styles.productModalBackdrop} type="button" onClick={() => setSelectedProduct(null)} aria-label="Fechar detalhes do produto" />
          <section className={styles.productModal} role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
            <button className={styles.modalClose} type="button" onClick={() => setSelectedProduct(null)} aria-label="Fechar">×</button>
            <div className={styles.modalGallery}>
              <div className={styles.modalImage} role="img" aria-label={selectedProduct.name}>
                <div className={`${styles.modalImageVisual} ${galleryView === 1 ? styles.galleryZoom : galleryView === 2 ? styles.galleryDetail : ""}`} style={{ backgroundImage: `url(${initialCategory.sheet})`, backgroundPosition: imagePositions[selectedProduct.imageIndex] }} />
              {selectedProduct.badge && <span className={styles.badge}>{selectedProduct.badge}</span>}
              </div>
              <div className={styles.galleryButtons}>{["Produto", "Detalhe", "Textura"].map((label, index) => <button className={galleryView === index ? styles.galleryActive : ""} type="button" onClick={() => setGalleryView(index)} key={label}>{label}</button>)}</div>
            </div>
            <div className={styles.modalDetails}>
              <span className={styles.modalEyebrow}>Lume · {initialCategory.name}</span>
              <h2 id="product-modal-title">{selectedProduct.name}</h2>
              <p>{selectedProduct.description}</p>
              {selectedProduct.oldPrice && <del>{formatCurrency(selectedProduct.oldPrice)}</del>}
              <strong className={styles.modalPrice}>{formatCurrency(selectedProduct.price)}</strong>
              <small>{selectedProduct.installment} sem juros</small>
              <div className={styles.ratingLine}><span>☆ ☆ ☆ ☆ ☆</span><strong>Novo na Lume</strong><small>avaliações reais em breve</small></div>

              {selectedProduct.colors && (
                <fieldset className={styles.optionGroup}>
                  <legend>{initialCategory.slug === "kits" ? "Embalagem" : "Cor"}: <strong>{productColor}</strong></legend>
                  <div className={styles.colorOptions}>
                    {selectedProduct.colors.map((color) => (
                      <button className={productColor === color ? styles.optionSelected : ""} type="button" onClick={() => setProductColor(color)} key={color} aria-label={`Escolher cor ${color}`}>
                        <span style={{ background: colorSwatches[color] || "#ddd" }} />{color}
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}

              {selectedProduct.sizes && (
                <fieldset className={styles.optionGroup}>
                  <legend>Tamanho: <strong>{productSize}</strong></legend>
                  <div className={styles.modalSizes}>
                    {selectedProduct.sizes.map((size) => <button className={productSize === size ? styles.optionSelected : ""} type="button" onClick={() => setProductSize(size)} key={size}>{size}</button>)}
                  </div>
                  <p className={styles.sizeHelp}>Grade inclusiva do P ao Plus 48–52</p>
                  <p className={styles.stockAvailable}>{typeof selectedProduct.stock === "number" ? (selectedProduct.stock <= 3 ? `Restam ${selectedProduct.stock} unidades` : `${selectedProduct.stock} unidades disponíveis`) : "Disponibilidade confirmada no atendimento"}</p>
                </fieldset>
              )}

              {initialCategory.slug === "personalizados" && (
                <label className={styles.personalNote}>
                  <span>Nome ou frase para personalizar</span>
                  <input value={productNote} onChange={(event) => setProductNote(event.target.value)} maxLength={50} placeholder="Ex.: Com carinho, para você" />
                  <small>Até 50 caracteres · confirme a arte pelo WhatsApp</small>
                </label>
              )}

              {initialCategory.slug === "kits" && (
                <label className={styles.personalNote}>
                  <span>Mensagem para o cartão</span>
                  <textarea value={productNote} onChange={(event) => setProductNote(event.target.value)} maxLength={120} placeholder="Escreva uma mensagem especial..." />
                  <small>Cartão personalizado incluso · até 120 caracteres</small>
                </label>
              )}

              <div className={styles.modalBuyRow}>
                <div className={styles.modalQuantity} aria-label="Quantidade">
                  <button type="button" onClick={() => setProductQuantity((value) => Math.max(1, value - 1))}>−</button>
                  <span>{productQuantity}</span>
                  <button type="button" onClick={() => setProductQuantity((value) => value + 1)}>+</button>
                </div>
                <button type="button" onClick={() => addToCart(selectedProduct, { size: productSize || undefined, color: productColor || undefined, quantity: productQuantity, note: productNote.trim() || undefined })}>Adicionar à sacola</button>
              </div>
              <div className={styles.modalBenefits}><span>Compra segura</span><span>Atendimento próximo</span><span>Troca facilitada</span></div>
              <div className={styles.customerReviews}><strong>Avaliações de clientes</strong><article><span>☆ ☆ ☆ ☆ ☆</span><p>Este produto ainda não recebeu uma avaliação publicada.</p><small>Somente avaliações de compras confirmadas aparecerão aqui.</small></article></div>
            </div>
          </section>
        </>
      )}

      {cartOpen && <button className={styles.cartBackdrop} type="button" onClick={() => setCartOpen(false)} aria-label="Fechar carrinho" />}
      <aside className={`${styles.cartDrawer} ${cartOpen ? styles.cartDrawerOpen : ""}`} aria-hidden={!cartOpen}>
        <div className={styles.cartHeader}><div><span>Sua sacola</span><strong>{itemCount} {itemCount === 1 ? "item" : "itens"}</strong></div><button type="button" onClick={() => setCartOpen(false)} aria-label="Fechar carrinho">×</button></div>
        <div className={styles.cartItems}>
          {cartLines.length ? cartLines.map(([lineKey, line]) => (
            <article className={styles.cartItem} key={lineKey}>
              <div className={styles.cartThumb} style={{ backgroundImage: `url(${line.sheet})`, backgroundPosition: imagePositions[line.imageIndex] }} />
              <div><h3>{line.productName}</h3>{(line.color || line.size || line.note) && <small className={styles.cartOptions}>{[line.color, line.size && `Tam. ${line.size}`, line.note && `“${line.note}”`].filter(Boolean).join(" · ")}</small>}<p>{formatCurrency(line.price)}</p><div className={styles.quantity}><button type="button" onClick={() => updateQuantity(lineKey, -1)}>−</button><span>{line.quantity}</span><button type="button" onClick={() => updateQuantity(lineKey, 1)}>+</button></div></div>
            </article>
          )) : <div className={styles.emptyCart}><span>♡</span><p>Sua sacola está vazia.</p></div>}
        </div>
        <div className={styles.cartFooter}>
          <section className={styles.cartTools}><label><span>Cupom</span><div><input value={couponInput} onChange={(event) => setCouponInput(event.target.value)} placeholder="LUME10" /><button type="button" onClick={applyCoupon}>Aplicar</button></div><small>{couponMessage || "Experimente LUME10 ou PIX5"}</small></label><label><span>Calcular entrega</span><div><input value={cep} onChange={(event) => setCep(event.target.value)} placeholder="00000-000" maxLength={9} /><button type="button" onClick={calculateShipping}>Calcular</button></div><small>{shipping?.label || "Retirada na loja também disponível"}</small></label><label><span>Forma de pagamento preferida</span><select value={payment} onChange={(event) => setPayment(event.target.value)}><option>Pix</option><option>Cartão</option><option>Dinheiro</option></select></label></section>
          {discount > 0 && <div className={styles.cartSummaryLine}><span>Desconto</span><strong>− {formatCurrency(discount)}</strong></div>}
          {shipping && shipping.price > 0 && <div className={styles.cartSummaryLine}><span>Entrega estimada</span><strong>{formatCurrency(shipping.price)}</strong></div>}
          <div><span>Total</span><strong>{formatCurrency(orderTotal)}</strong></div><button type="button" disabled={!cartLines.length} onClick={sendOrder}>Finalizar pelo WhatsApp</button><small>Frete e disponibilidade são confirmados no atendimento.</small>
        </div>
      </aside>
    </main>
  );
}
