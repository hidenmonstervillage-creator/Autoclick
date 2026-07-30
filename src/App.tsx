import React, { useEffect, useState } from 'react';
import {
  Phone,
  Star,
  MapPin,
  Globe,
  Megaphone,
  CheckCircle,
  ArrowRight,
  Truck,
  Car,
  Search,
  Shield,
  X,
  AlertTriangle
} from 'lucide-react';
import LastGroupSection from './LastGroupSection';

const DEADLINE = new Date('2026-08-18T23:59:59+03:00');

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isClosed: boolean;
  phase: 'A' | 'B' | 'C' | 'D' | 'E';
}

function useCountdown(): CountdownState {
  const [countdown, setCountdown] = useState<CountdownState>(() => {
    const now = Date.now();
    const totalMs = DEADLINE.getTime() - now;
    const isClosed = totalMs <= 0;

    if (isClosed) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalMs: 0,
        isClosed: true,
        phase: 'E'
      };
    }

    const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((totalMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((totalMs % (1000 * 60)) / 1000);

    let phase: 'A' | 'B' | 'C' | 'D' | 'E' = 'A';
    if (days > 30) phase = 'A';
    else if (days >= 8) phase = 'B';
    else if (days >= 1) phase = 'C';
    else phase = 'D';

    return {
      days,
      hours,
      minutes,
      seconds,
      totalMs,
      isClosed: false,
      phase
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const totalMs = DEADLINE.getTime() - now;
      const isClosed = totalMs <= 0;

      if (isClosed) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalMs: 0,
          isClosed: true,
          phase: 'E'
        });
        return;
      }

      const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((totalMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((totalMs % (1000 * 60)) / 1000);

      let phase: 'A' | 'B' | 'C' | 'D' | 'E' = 'A';
      if (days > 30) phase = 'A';
      else if (days >= 8) phase = 'B';
      else if (days >= 1) phase = 'C';
      else phase = 'D';

      setCountdown({
        days,
        hours,
        minutes,
        seconds,
        totalMs,
        isClosed: false,
        phase
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return countdown;
}

function CountdownSmall({ days, hours, minutes, seconds }: { days: number; hours: number; minutes: number; seconds: number }) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <div className="font-mono text-lg md:text-2xl font-black tracking-wider text-white">
      {pad(days)}:{pad(hours)}:{pad(minutes)}:{pad(seconds)}
    </div>
  );
}

function CountdownLarge({ days, hours, minutes, seconds }: { days: number; hours: number; minutes: number; seconds: number }) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <div className="font-mono text-3xl md:text-5xl font-black tracking-wider text-white">
      <span className="text-4xl md:text-6xl">{pad(days)}</span>
      <span className="mx-2 text-yellow-400">:</span>
      <span>{pad(hours)}</span>
      <span className="mx-2 text-yellow-400">:</span>
      <span>{pad(minutes)}</span>
      <span className="mx-2 text-yellow-400">:</span>
      <span>{pad(seconds)}</span>
    </div>
  );
}

function ImpossibleSolutionsLink({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <a
      href="https://impossiblesolutions.eu"
      target="_blank"
      rel="noopener noreferrer"
      className={`font-bold text-yellow-400 hover:text-yellow-300 underline transition-colors ${className}`}
    >
      {children}
    </a>
  );
}

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const countdown = useCountdown();
  const closingRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToClosing = () => {
    closingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <style>{`
        @keyframes hazard-pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.02);
          }
        }
        .hazard-pulse {
          animation: hazard-pulse 1.4s infinite;
        }
        @keyframes slow-blink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }
        .slow-blink {
          animation: slow-blink 2s infinite;
        }
      `}</style>

      {/* Navigation */}
      <nav className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-gray-800 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Truck className="w-8 h-8 text-yellow-400" />
            <span className="text-2xl font-bold text-yellow-400">AutoClick</span>
          </div>
          <button className="bg-yellow-400 text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-300 transition-all duration-300 hover:scale-105">
            <a href="tel:0886516012">Обадете се сега</a>
          </button>
        </div>
      </nav>

      {/* Slim Sticky Ticker */}
      {!countdown.isClosed && (
        <div className="sticky top-16 z-40 bg-slate-900" style={{ backgroundColor: '#161616' }}>
          <div className="container mx-auto px-4 py-2 flex items-center">
            <div className="w-2 h-2 rounded-full mr-2 flex-shrink-0 slow-blink" style={{ backgroundColor: '#E24B4A' }}></div>
            <span className="text-xs md:text-sm font-medium" style={{ color: '#c9c9c9' }}>
              Докато четете това, авариралите звънят на някой друг
            </span>
          </div>
        </div>
      )}

      {/* Floating Hazard Badge - Bottom Right */}
      {!countdown.isClosed && (
        <button
          onClick={scrollToClosing}
          className="fixed bottom-4 right-4 z-30 hazard-pulse md:w-auto"
          style={{ width: '96px' }}
        >
          <div
            className="rounded-lg p-3 flex flex-col items-center justify-center border-2"
            style={{
              backgroundColor: '#C20000',
              borderColor: '#ff5a5a'
            }}
          >
            <AlertTriangle className="w-6 h-6 md:w-7 md:h-7 text-white mb-1" />
            <div className="text-xs md:text-sm font-mono font-black text-white">
              {String(countdown.days).padStart(2, '0')}:{String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
            </div>
            <div className="text-xs md:text-xs mt-1 text-center" style={{ color: '#ffd4d4' }}>
              до 18.08 · защо затваряме ↓
            </div>
          </div>
        </button>
      )}

      {/* Hero Section */}
      {countdown.isClosed ? (
        // Closed State
        <section className="py-32 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <h1 className="text-5xl lg:text-7xl font-black mb-8 text-white">
              AutoClick е затворен за нови клиенти.
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 mb-6 leading-relaxed">
              Прозорецът се затвори на 18.08.2026. Благодаря на всички, които влязоха навреме.
            </p>
            <p className="text-xl lg:text-2xl text-gray-300 mb-12 leading-relaxed">
              Все още искате да работим заедно? Сега е през <ImpossibleSolutionsLink>Impossible Solutions</ImpossibleSolutionsLink>.
            </p>
            <a
              href="https://impossiblesolutions.eu"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center bg-yellow-400 text-black px-8 py-4 rounded-full text-xl font-bold hover:bg-yellow-300 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/25"
            >
              Към Impossible Solutions
              <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </section>
      ) : (
        // Active State Hero
        <section className="relative py-20 px-4 overflow-hidden pt-32">
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-transparent z-10"></div>
          <div className={`container mx-auto relative z-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 lg:col-span-2 text-center">
                <h1 className="text-5xl lg:text-7xl font-black leading-tight">
                  <span className="text-white">Виждат ви.</span><br />
                  <span className="text-yellow-400">Звънят ви.</span><br />
                  <span className="text-red-500">Печелите повече.</span>
                </h1>

                <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed">
                  AutoClick изкарва Пътната ви помощ на първите места в Google и водещите онлайн пазари.
                </p>

                <p className="text-lg lg:text-xl text-yellow-400 font-semibold">
                  Качваме пътната помощ на върха на Google.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="tel:0886516012" className="group bg-yellow-400 text-black px-8 py-4 rounded-full text-xl font-bold hover:bg-yellow-300 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/25 flex items-center justify-center mx-auto">
                    <Phone className="w-6 h-6 mr-2 group-hover:animate-bounce" />
                    Обадете се сега
                    <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Google Top Positions Section */}
      {!countdown.isClosed && (
        <section className="py-20 px-4 bg-gray-900/50">
          <div className="container mx-auto">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-4xl lg:text-6xl font-black mb-8 leading-tight">
                Първите <span className="text-yellow-400">5 позиции</span> в Гугъл получават <span className="text-red-500">99%</span> от обажданията.
              </h2>

              <div className="space-y-6 text-xl lg:text-2xl text-gray-300 mb-12">
                <p className="leading-relaxed">
                  <span className="text-yellow-400 font-bold">100%</span> от случайте това са оптимизирани уебсайтове с Гугъл Бизнес профили.
                </p>

                <p className="leading-relaxed">
                  Обявите във <span className="text-red-400 font-bold">Facebook, OLX, Bazar</span> и други локални сайтове <span className="text-red-500 font-bold">НЕ РАБОТЯТ</span>.
                </p>

                <p className="leading-relaxed">
                  Не се опитвайте да плувате срещу течението, а позиционирайте бизнесът си сред тези <span className="text-yellow-400 font-bold">топ 5 позиции</span> в Гугъл
                </p>
              </div>

              <a href="tel:0886516012" className="group inline-flex items-center bg-yellow-400 text-black px-8 py-4 rounded-full text-xl font-bold hover:bg-yellow-300 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/25">
                <Phone className="w-6 h-6 mr-2 group-hover:animate-bounce" />
                Обадете се сега
                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Why This Works Section */}
      {!countdown.isClosed && (
        <section className="py-20 px-4 bg-gray-900/50">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-6xl font-black mb-6">
                Една услуга, която <span className="text-yellow-400">обхваща всичко</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Вместо да се занимавате с множество доставчици, ние ви предлагаме цялостно решение
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: MapPin,
                  title: "Google Business профил",
                  description: "Професионална настройка за ТОП позиция в Google Maps с оптимизирани снимки, описания и отзиви",
                  color: "text-yellow-400"
                },
                {
                  icon: Globe,
                  title: "Модерен уебсайт",
                  description: "Уебсайт, който привлича клиенти 24/7 с мобилна оптимизация и бърза скорост на зареждане",
                  color: "text-blue-400"
                },
                {
                  icon: Megaphone,
                  title: "Поддръжка",
                  description: "Осигуряваме вашето задържане на челните 5 позиции за вашият регион",
                  color: "text-red-400"
                }
              ].map((feature, index) => (
                <div key={index} className="group bg-black/50 rounded-3xl p-8 border border-gray-700 hover:border-yellow-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                  <div className={`w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${feature.color}`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-yellow-400 transition-colors">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process Section */}
      {!countdown.isClosed && (
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-6xl font-black mb-6">
                Нашият <span className="text-yellow-400">процес</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Три прости стъпки към повече клиенти и по-високи приходи
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Настройка",
                  description: "Създаваме и оптимизираме Google Business профила ви с професионални снимки, описания и ключови думи за максимална видимост"
                },
                {
                  step: "02",
                  title: "Изграждане",
                  description: "Изработваме модерен, мобилен уебсайт за вашите услуги с бързо зареждане и оптимизация за търсачки"
                },
                {
                  step: "03",
                  title: "Поддръжка",
                  description: "Постоянно следим алгоритъмът на търсенията в Гугъл за вашият регион, за да поддържате своята топ 5 позиция в Google"
                }
              ].map((process, index) => (
                <div key={index} className="relative">
                  <div className="bg-gradient-to-br from-yellow-400/10 to-red-500/10 rounded-3xl p-8 border border-yellow-400/20 hover:border-yellow-400/50 transition-all duration-500 hover:scale-105">
                    <div className="text-6xl font-black text-yellow-400/20 mb-4">{process.step}</div>
                    <h3 className="text-3xl font-bold mb-4 text-yellow-400">{process.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{process.description}</p>
                  </div>

                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 translate-x-1/2">
                      <ArrowRight className="w-8 h-8 text-yellow-400/50" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing Section */}
      {!countdown.isClosed && (
        <section className="py-20 px-4 bg-gradient-to-r from-yellow-400/5 to-red-500/5">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-6xl font-black mb-6">
                Една цена. <span className="text-yellow-400">Всичко включено.</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Без скрити такси, без ограничения. Получавате пълното решение за онлайн видимост
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-black border-4 border-yellow-400 rounded-3xl p-8 lg:p-12 relative overflow-hidden hover:scale-105 transition-transform duration-500">
                <div className="text-center mb-8">
                  <h3 className="text-3xl lg:text-4xl font-bold text-yellow-400 mb-4">Пълен Онлайн Старт</h3>
                  <div className="text-6xl lg:text-8xl font-black text-white mb-4">
                    €1287
                  </div>
                  <p className="text-gray-400 text-lg">Еднократна инвестиция за дългосрочни резултати</p>
                </div>

                <div className="space-y-4 mb-8">
                  {[
                    "Google Business профил оптимизация",
                    "Модерен, мобилен уебсайт",
                    "Промоция в много други канали",
                    "SEO оптимизация за търсачки",
                    "Професионални снимки и текстове",
                    "Достъп до софтуер за намиране на аварии и катастрофи на пътя до вас в България!"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <a
                  href="tel:0886516012"
                  className="w-full bg-yellow-400 text-black py-4 rounded-full text-xl font-bold hover:bg-yellow-300 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/25 flex items-center justify-center"
                >
                  <Phone className="w-6 h-6 mr-2" />
                  Започнете днес
                  <ArrowRight className="w-6 h-6 ml-2" />
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Last Group social-proof map */}
      {!countdown.isClosed && <LastGroupSection />}

      {/* Why Closing Section */}
      {!countdown.isClosed && (
        <section className="py-20 px-4 bg-gradient-to-r from-red-900/20 to-transparent">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-4xl lg:text-6xl font-black mb-12 text-center">
              Защо затварям, докато върви?
            </h2>

            <div className="space-y-8">
              <p className="text-xl text-gray-300 leading-relaxed">
                Защото по-големите пари са другаде. AutoClick имаше една цел — да направи автобизнесите видими онлайн и да им докара реални клиенти. Това е свършено.
              </p>

              <p className="text-xl text-gray-300 leading-relaxed">
                Не затварям, защото се провали. Затварям, защото спечели — и аз продължавам нагоре. Времето ми вече отива в <ImpossibleSolutionsLink>Impossible Solutions</ImpossibleSolutionsLink>, при по-сериозни клиенти и по-сериозни бюджети.
              </p>

              <p className="text-xl lg:text-2xl text-white leading-relaxed bg-gradient-to-r from-yellow-400/10 to-red-500/10 p-8 rounded-2xl border border-yellow-400/30">
                Но преди да дръпна щепсела, приемам последна група клиенти от бранша. На цени за автоуслуги. За последно.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* What Happens Section - Target for scroll */}
      {!countdown.isClosed && (
        <section id="zashto-zatvariame" ref={closingRef} className="py-20 px-4 bg-gray-900/50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-4xl lg:text-6xl font-black mb-8 text-center">
              AutoClick приема нови клиенти само до 18.08.2026. След това — само през <ImpossibleSolutionsLink className="text-white no-underline hover:underline">Impossible Solutions</ImpossibleSolutionsLink>, на цени за клиника.
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[
                {
                  title: 'Спирам да приемам нови клиенти в AutoClick. Завинаги.',
                  icon: X
                },
                {
                  title: 'Брандът AutoClick изчезва.',
                  icon: Star
                },
                {
                  title: (
                    <>
                      Същата услуга остава достъпна — но само през <ImpossibleSolutionsLink className="text-white no-underline hover:underline">Impossible Solutions</ImpossibleSolutionsLink>, на цените, които плащат медицинските клиники.
                    </>
                  ),
                  icon: Truck
                }
              ].map((item, index) => (
                <div key={index} className="bg-black/50 rounded-2xl p-6 border border-gray-700 hover:border-red-600/50 transition-all">
                  <div className="flex items-center mb-4">
                    <item.icon className="w-8 h-8 text-red-600 mr-3 flex-shrink-0" />
                  </div>
                  <p className="text-lg text-gray-300 leading-relaxed">{item.title}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-red-600/30 to-red-900/30 border-2 border-red-600 rounded-2xl p-8 mb-12">
              <p className="text-xl lg:text-2xl text-white leading-relaxed">
                <span className="font-black">Днес плащате цена за автоуслуги.</span>
                <br className="my-2" />
                <span className="font-black">След 18.08 плащате колкото клиника — за същото.</span>
                <br className="my-2" />
                <span className="text-yellow-400 font-black">Изборът е прост, а таймерът върви.</span>
              </p>
            </div>

            <div className="text-center mb-8">
              <div className="mb-8">
                <CountdownLarge
                  days={countdown.days}
                  hours={countdown.hours}
                  minutes={countdown.minutes}
                  seconds={countdown.seconds}
                />
              </div>
              <a
                href="tel:0886516012"
                className="group inline-flex items-center bg-yellow-400 text-black px-12 py-6 rounded-full text-2xl font-bold transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-yellow-400/50"
              >
                <Phone className="w-8 h-8 mr-3 group-hover:animate-bounce" />
                Запазете място сега
                <ArrowRight className="w-8 h-8 ml-3 group-hover:translate-x-2 transition-transform" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Final CTA Section */}
      {!countdown.isClosed && (
        <section className="py-20 px-4 bg-gradient-to-r from-red-900/40 to-yellow-900/40">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl lg:text-6xl font-black mb-8 leading-tight">
                Катастрофиралите търсят пътна помощ <span className="text-yellow-400">ОНЛАЙН</span>.
                <br />
                Уверете се, че намират <span className="text-red-500">Вас първи</span>.
              </h2>

              <p className="text-2xl text-gray-300 mb-12 leading-relaxed">
                AutoClick прави така, че телефонът ви да звъни по-често.
                <br />
                Всеки ден без професионален онлайн профил = загубени клиенти.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <a href="tel:0886516012" className="group bg-yellow-400 text-black px-12 py-6 rounded-full text-2xl font-bold hover:bg-yellow-300 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-yellow-400/50 flex items-center animate-pulse">
                  <Phone className="w-8 h-8 mr-3 group-hover:animate-bounce" />
                  Започнете днес
                  <ArrowRight className="w-8 h-8 ml-3 group-hover:translate-x-2 transition-transform" />
                </a>

                <div className="text-gray-400 text-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Налични сме сега</span>
                  </div>
                </div>
              </div>

              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  { number: "597%", label: "Ръст на заявки" },
                  { number: "24/7", label: "Онлайн видимост" },
                  { number: "100%", label: "Доволни клиенти" },
                  { number: "48ч", label: "Време за стартиране" }
                ].map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="text-3xl lg:text-4xl font-bold text-yellow-400">{stat.number}</div>
                    <div className="text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 px-4 bg-black border-t border-gray-800">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Truck className="w-8 h-8 text-yellow-400" />
              <span className="text-2xl font-bold text-yellow-400">AutoClick</span>
            </div>

            <div className="flex items-center space-x-6 text-gray-400">
              <span>📞 088 651 6012</span>
              <span>📧 mihaillenkov6@gmail.com</span>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500">
            <p>&copy; 2024 AutoClick. Всички права запазени.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
