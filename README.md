<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    
    <!-- Meta tags para SEO e redes sociais -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Laser Beauty" />
    <meta property="og:title" content="Laser Beauty - Depilação a Laser" />
    <meta property="og:description" content="Depilação a laser com tecnologia de ponta. Resultados duradouros e pele lisinha." />
    <meta name="description" content="Depilação a laser com tecnologia de ponta. Resultados duradouros e pele lisinha." />
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    <title>Laser Beauty - Depilação a Laser</title>
    
    <style>
      /* Reset e estilos base */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: #f8f5f7;
        color: #2d1b2a;
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
      }
      
      /* Header */
      .header {
        background: linear-gradient(135deg, #2d1b2a 0%, #4a2b44 50%, #6a3b60 100%);
        color: #fff;
        padding: 20px 0;
        box-shadow: 0 4px 20px rgba(45, 27, 42, 0.3);
        position: sticky;
        top: 0;
        z-index: 100;
      }
      
      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 15px;
      }
      
      .logo {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .logo img {
        height: 45px;
        width: auto;
      }
      
      .logo h1 {
        font-size: 1.8rem;
        font-weight: 800;
        letter-spacing: -0.5px;
      }
      
      .logo span {
        color: #f0c8e8;
      }
      
      .header-cta {
        background: #f0c8e8;
        color: #2d1b2a;
        padding: 10px 24px;
        border-radius: 50px;
        font-weight: 700;
        text-decoration: none;
        transition: all 0.3s ease;
        font-size: 0.95rem;
      }
      
      .header-cta:hover {
        background: #ffdff5;
        transform: scale(1.05);
        box-shadow: 0 4px 15px rgba(240, 200, 232, 0.4);
      }
      
      /* Hero Section */
      .hero {
        padding: 60px 0 40px;
        background: linear-gradient(180deg, #f8f5f7 0%, #f0e8ed 100%);
      }
      
      .hero-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 50px;
        align-items: center;
      }
      
      .hero-content h2 {
        font-size: 3rem;
        font-weight: 800;
        line-height: 1.1;
        color: #2d1b2a;
        margin-bottom: 20px;
      }
      
      .hero-content h2 .highlight {
        color: #8a4b7a;
        position: relative;
      }
      
      .hero-content h2 .highlight::after {
        content: '';
        position: absolute;
        bottom: 5px;
        left: 0;
        width: 100%;
        height: 12px;
        background: rgba(240, 200, 232, 0.4);
        border-radius: 4px;
        z-index: -1;
      }
      
      .hero-content p {
        font-size: 1.2rem;
        color: #4a3b47;
        margin-bottom: 30px;
        max-width: 500px;
      }
      
      .hero-buttons {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
      }
      
      .btn-primary {
        background: linear-gradient(135deg, #8a4b7a, #6a3b60);
        color: #fff;
        padding: 14px 36px;
        border: none;
        border-radius: 50px;
        font-weight: 700;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
        display: inline-block;
      }
      
      .btn-primary:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(138, 75, 122, 0.4);
      }
      
      .btn-secondary {
        background: transparent;
        color: #6a3b60;
        padding: 14px 36px;
        border: 2px solid #8a4b7a;
        border-radius: 50px;
        font-weight: 700;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
        display: inline-block;
      }
      
      .btn-secondary:hover {
        background: #8a4b7a;
        color: #fff;
        transform: translateY(-3px);
      }
      
      .hero-image {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      
      .hero-image img {
        width: 100%;
        max-width: 450px;
        height: auto;
        border-radius: 30px;
        box-shadow: 0 20px 60px rgba(45, 27, 42, 0.15);
        object-fit: cover;
        aspect-ratio: 1;
      }
      
      /* Stats */
      .stats {
        background: #fff;
        padding: 40px 0;
        border-top: 1px solid #e8d5e4;
        border-bottom: 1px solid #e8d5e4;
      }
      
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 30px;
        text-align: center;
      }
      
      .stat-item h3 {
        font-size: 2.2rem;
        font-weight: 800;
        color: #8a4b7a;
      }
      
      .stat-item p {
        color: #6a5b67;
        font-weight: 500;
      }
      
      /* Services */
      .services {
        padding: 60px 0;
      }
      
      .section-title {
        text-align: center;
        font-size: 2.5rem;
        font-weight: 800;
        color: #2d1b2a;
        margin-bottom: 15px;
      }
      
      .section-subtitle {
        text-align: center;
        color: #6a5b67;
        font-size: 1.1rem;
        margin-bottom: 40px;
      }
      
      .services-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 30px;
      }
      
      .service-card {
        background: #fff;
        border-radius: 20px;
        padding: 30px 25px;
        text-align: center;
        box-shadow: 0 4px 20px rgba(45, 27, 42, 0.06);
        transition: all 0.3s ease;
        border: 1px solid #f0e8ed;
      }
      
      .service-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 40px rgba(45, 27, 42, 0.1);
        border-color: #d4b8ce;
      }
      
      .service-card img {
        width: 70px;
        height: 70px;
        object-fit: contain;
        margin-bottom: 15px;
      }
      
      .service-card h3 {
        font-size: 1.3rem;
        color: #2d1b2a;
        margin-bottom: 10px;
      }
      
      .service-card p {
        color: #6a5b67;
        font-size: 0.95rem;
      }
      
      .service-card .price {
        display: block;
        margin-top: 15px;
        font-weight: 700;
        font-size: 1.3rem;
        color: #8a4b7a;
      }
      
      /* Benefits */
      .benefits {
        background: #fff;
        padding: 60px 0;
      }
      
      .benefits-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 30px;
      }
      
      .benefit-item {
        display: flex;
        gap: 20px;
        align-items: flex-start;
        padding: 25px;
        background: #f8f5f7;
        border-radius: 16px;
        transition: all 0.3s ease;
      }
      
      .benefit-item:hover {
        background: #f0e8ed;
        transform: translateX(5px);
      }
      
      .benefit-item img {
        width: 40px;
        height: 40px;
        object-fit: contain;
        min-width: 40px;
      }
      
      .benefit-item h4 {
        color: #2d1b2a;
        margin-bottom: 5px;
      }
      
      .benefit-item p {
        color: #6a5b67;
        font-size: 0.95rem;
      }
      
      /* CTA Section */
      .cta-section {
        background: linear-gradient(135deg, #2d1b2a, #4a2b44);
        color: #fff;
        padding: 60px 0;
        text-align: center;
      }
      
      .cta-section h2 {
        font-size: 2.5rem;
        font-weight: 800;
        margin-bottom: 15px;
      }
      
      .cta-section p {
        font-size: 1.2rem;
        opacity: 0.9;
        margin-bottom: 30px;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
      }
      
      .cta-section .btn-primary {
        background: #f0c8e8;
        color: #2d1b2a;
        font-size: 1.1rem;
        padding: 16px 48px;
      }
      
      .cta-section .btn-primary:hover {
        background: #ffdff5;
        box-shadow: 0 8px 30px rgba(240, 200, 232, 0.3);
      }
      
      /* Footer */
      .footer {
        background: #1a1118;
        color: #b8a5b3;
        padding: 40px 0;
        text-align: center;
      }
      
      .footer p {
        font-size: 0.9rem;
      }
      
      .footer a {
        color: #f0c8e8;
        text-decoration: none;
      }
      
      .footer a:hover {
        text-decoration: underline;
      }
      
      /* Responsive */
      @media (max-width: 992px) {
        .hero-grid {
          grid-template-columns: 1fr;
          text-align: center;
        }
        
        .hero-content p {
          margin-left: auto;
          margin-right: auto;
        }
        
        .hero-buttons {
          justify-content: center;
        }
        
        .hero-image img {
          max-width: 350px;
        }
        
        .services-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        
        .stats-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      
      @media (max-width: 768px) {
        .hero-content h2 {
          font-size: 2.2rem;
        }
        
        .services-grid {
          grid-template-columns: 1fr;
        }
        
        .benefits-grid {
          grid-template-columns: 1fr;
        }
        
        .header-content {
          flex-direction: column;
          text-align: center;
        }
        
        .stats-grid {
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        .logo h1 {
          font-size: 1.4rem;
        }
        
        .logo img {
          height: 35px;
        }
      }
      
      @media (max-width: 480px) {
        .hero-content h2 {
          font-size: 1.8rem;
        }
        
        .hero-buttons {
          flex-direction: column;
          align-items: center;
        }
        
        .hero-buttons .btn-primary,
        .hero-buttons .btn-secondary {
          width: 100%;
          text-align: center;
        }
        
        .stats-grid {
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        
        .stat-item h3 {
          font-size: 1.6rem;
        }
        
        .section-title {
          font-size: 1.8rem;
        }
        
        .cta-section h2 {
          font-size: 1.8rem;
        }
        
        .hero-image img {
          max-width: 280px;
        }
      }
    </style>
  </head>
  <body>
    <!-- Header -->
    <header class="header">
      <div class="container header-content">
        <div class="logo">
          <img src="https://raw.githubusercontent.com/seu-usuario/seu-repositorio/main/logo-laser-beauty.png" alt="Laser Beauty Logo" />
          <h1>Laser <span>Beauty</span></h1>
        </div>
        <a href="#contato" class="header-cta">Agende sua Avaliação</a>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-content">
          <h2>
            Depilação a Laser<br>
            <span class="highlight">Definitiva e Indolor</span>
          </h2>
          <p>
            Tecnologia de ponta para resultados duradouros. Pele lisinha e macia 
            com segurança e conforto. Agende sua avaliação gratuita!
          </p>
          <div class="hero-buttons">
            <a href="#contato" class="btn-primary">Quero Agendar</a>
            <a href="#servicos" class="btn-secondary">Conheça os Serviços</a>
          </div>
        </div>
        <div class="hero-image">
          <img src="https://raw.githubusercontent.com/seu-usuario/seu-repositorio/main/hero-laser.jpg" alt="Depilação a Laser" />
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="stats">
      <div class="container stats-grid">
        <div class="stat-item">
          <h3>10K+</h3>
          <p>Clientes atendidas</p>
        </div>
        <div class="stat-item">
          <h3>98%</h3>
          <p>Satisfação comprovada</p>
        </div>
        <div class="stat-item">
          <h3>15+</h3>
          <p>Anos de experiência</p>
        </div>
        <div class="stat-item">
          <h3>5★</h3>
          <p>Avaliação máxima</p>
        </div>
      </div>
    </section>

    <!-- Services -->
    <section class="services" id="servicos">
      <div class="container">
        <h2 class="section-title">Nossos Serviços</h2>
        <p class="section-subtitle">
          Tecnologia de última geração para todos os tipos de pele
        </p>
        <div class="services-grid">
          <div class="service-card">
            <img src="https://raw.githubusercontent.com/seu-usuario/seu-repositorio/main/icon-pernas.png" alt="Pernas" />
            <h3>Pernas Completas</h3>
            <p>Depilação definitiva das pernas inteiras com laser de diodo</p>
            <span class="price">12x R$ 89,90</span>
          </div>
          <div class="service-card">
            <img src="https://raw.githubusercontent.com/seu-usuario/seu-repositorio/main/icon-axilas.png" alt="Axilas" />
            <h3>Axilas</h3>
            <p>Resultado rápido e eficaz para axilas livres de pelos</p>
            <span class="price">12x R$ 49,90</span>
          </div>
          <div class="service-card">
            <img src="https://raw.githubusercontent.com/seu-usuario/seu-repositorio/main/icon-biquini.png" alt="Biquíni" />
            <h3>Faixa Biquíni</h3>
            <p>Depilação precisa e confortável na região do biquíni</p>
            <span class="price">12x R$ 69,90</span>
          </div>
          <div class="service-card">
            <img src="https://raw.githubusercontent.com/seu-usuario/seu-repositorio/main/icon-bracos.png" alt="Braços" />
            <h3>Braços</h3>
            <p>Remoção completa dos pelos dos braços com laser</p>
            <span class="price">12x R$ 59,90</span>
          </div>
          <div class="service-card">
            <img src="https://raw.githubusercontent.com/seu-usuario/seu-repositorio/main/icon-rosto.png" alt="Rosto" />
            <h3>Rosto Completo</h3>
            <p>Depilação facial suave para buço, queixo e costeletas</p>
            <span class="price">12x R$ 79,90</span>
          </div>
          <div class="service-card">
            <img src="https://raw.githubusercontent.com/seu-usuario/seu-repositorio/main/icon-pacote.png" alt="Pacote Completo" />
            <h3>Pacote Completo</h3>
            <p>Pernas + axilas + biquíni com desconto especial</p>
            <span class="price">12x R$ 149,90</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits -->
    <section class="benefits" id="beneficios">
      <div class="container">
        <h2 class="section-title">Por que escolher a Laser Beauty?</h2>
        <p class="section-subtitle">
          Benefícios exclusivos para você ter a melhor experiência
        </p>
        <div class="benefits-grid">
          <div class="benefit-item">
            <img src="https://raw.githubusercontent.com/seu-usuario/seu-repositorio/main/icon-tecnologia.png" alt="Tecnologia" />
            <div>
              <h4>Tecnologia Avançada</h4>
              <p>Laser de diodo com sistema de resfriamento para máximo conforto e eficácia.</p>
            </div>
          </div>
          <div class="benefit-item">
            <img src="https://raw.githubusercontent.com/seu-usuario/seu-repositorio/main/icon-profissionais.png" alt="Profissionais" />
            <div>
              <h4>Profissionais Especializados</h4>
              <p>Equipe treinada e certificada para garantir segurança e resultados.</p>
            </div>
          </div>
          <div class="benefit-item">
            <img src="https://raw.githubusercontent.com/seu-usuario/seu-repositorio/main/icon-resultados.png" alt="Resultados" />
            <div>
              <h4>Resultados Duradouros</h4>
              <p>Redução permanente dos pelos com poucas sessões e alta eficácia.</p>
            </div>
          </div>
          <div class="benefit-item">
            <img src="https://raw.githubusercontent.com/seu-usuario/seu-repositorio/main/icon-ambiente.png" alt="Ambiente" />
            <div>
              <h4>Ambiente Acolhedor</h4>
              <p>Espaço pensado para seu conforto, bem-estar e privacidade.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section" id="contato">
      <div class="container">
        <h2>Pronta para se livrar dos pelos?</h2>
        <p>
          Agende sua avaliação gratuita e descubra como a depilação a laser 
          pode transformar sua rotina e autoestima.
        </p>
        <a href="#" class="btn-primary">Agende sua Avaliação</a>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <p>
          &copy; 2026 Laser Beauty - Depilação a Laser. Todos os direitos reservados.
          <br>
          <a href="#">Política de Privacidade</a> | <a href="#">Termos de Uso</a>
        </p>
      </div>
    </footer>

    <!-- Scripts -->
    <script>
      // Script para smooth scroll nos links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });

      // Animação simples ao scroll (para demonstrar interatividade)
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('.service-card, .benefit-item, .stat-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
      });

      // Forçar exibição inicial para elementos visíveis
      setTimeout(() => {
        document.querySelectorAll('.service-card, .benefit-item, .stat-item').forEach(el => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        });
      }, 300);
    </script>
  </body>
</html>
