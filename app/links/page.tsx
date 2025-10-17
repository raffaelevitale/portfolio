import Link from "next/link";

export const metadata = {
  title: "Links & Contact",
  description: "Connect with me through various platforms and contact information",
};

export default function LinksPage() {
  // Social media and contact links
  const links = [
    {
      id: 1,
      title: "Instagram",
      url: "https://instagram.com/username",
      description: "Follow my latest work and behind-the-scenes content",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      id: 2,
      title: "Behance",
      url: "https://behance.net/username",
      description: "View my design portfolio and creative projects",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M7.443 5.35c.639 0 1.23.05 1.77.198.541.099.984.297 1.377.544.394.247.689.594.885 1.039.197.445.296.989.296 1.583 0 .693-.148 1.286-.492 1.731-.295.446-.787.841-1.377 1.138.836.248 1.475.693 1.869 1.287.394.594.64 1.336.64 2.177 0 .693-.148 1.286-.394 1.781-.246.495-.639.94-1.082 1.237-.443.297-.984.544-1.574.692-.59.148-1.18.198-1.77.198H1.77V5.35h5.673v.001zm-.345 5.96c.541 0 .984-.148 1.328-.396.344-.247.492-.693.492-1.237 0-.297-.05-.544-.148-.742-.099-.198-.246-.347-.394-.495-.197-.099-.394-.198-.64-.247-.246-.05-.491-.05-.787-.05H4.098v3.167h3zm.197 6.237c.295 0 .59-.05.836-.099.246-.05.492-.148.688-.297.197-.148.344-.297.443-.544.099-.198.148-.495.148-.841 0-.693-.197-1.188-.59-1.534-.394-.297-.935-.445-1.574-.445H4.098v3.76h3.197zm8.984-5.292c.541-.247 1.033-.594 1.426-1.04.394-.444.738-.939.984-1.534.246-.594.394-1.237.394-1.93 0-.693-.099-1.337-.345-1.93-.246-.594-.59-1.09-1.033-1.535a4.5 4.5 0 00-1.574-1.04c-.64-.247-1.328-.346-2.115-.346-.787 0-1.475.099-2.115.346-.59.247-1.131.594-1.574 1.04-.443.445-.787.94-1.033 1.534-.246.594-.345 1.238-.345 1.93 0 .693.099 1.337.345 1.93.246.595.59 1.09 1.033 1.535.443.445.984.792 1.574 1.04.64.246 1.328.346 2.115.346.787 0 1.475-.1 2.115-.347 0 .001.049.001.148.001zm-3.935-1.436c-.345.346-.836.544-1.426.544-.541 0-1.033-.198-1.377-.544-.344-.346-.541-.841-.541-1.436h3.886c0 .595-.197 1.09-.542 1.436zm.738-2.672h-3.886c0-.594.197-1.09.541-1.435.344-.347.836-.545 1.377-.545.59 0 1.082.198 1.426.545.345.346.542.841.542 1.435zm.394-3.315h4.967v1.188h-4.967V4.832z" />
        </svg>
      ),
    },
    {
      id: 3,
      title: "LinkedIn",
      url: "https://linkedin.com/in/username",
      description: "Connect professionally and view my experience",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
        </svg>
      ),
    },
    {
      id: 4,
      title: "Email",
      url: "mailto:contact@example.com",
      description: "Send me an email for inquiries or collaborations",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
    },
    {
      id: 5,
      title: "Dribbble",
      url: "https://dribbble.com/username",
      description: "Check out my design shots and works in progress",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen py-20 px-6">
      {/* Header */}
      <header className="max-w-4xl mx-auto mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Connect With Me</h1>
        <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
          Find me on various platforms or get in touch directly for collaborations, 
          inquiries, or just to say hello.
        </p>
      </header>

      {/* Links Grid */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-xl border border-foreground/10 hover:border-foreground/30 bg-foreground/[0.02] hover:bg-foreground/[0.05] transition-all duration-300 flex items-start gap-4 group"
            >
              <div className="text-foreground/70 group-hover:text-foreground transition-colors">
                {link.icon}
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 flex items-center">
                  {link.title}
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor" 
                    className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                  </svg>
                </h3>
                <p className="text-foreground/70">{link.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="max-w-4xl mx-auto mt-24 py-16 border-t border-foreground/10">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Send Me a Message</h2>
        <div className="bg-foreground/[0.02] rounded-xl p-8 border border-foreground/10">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 rounded-lg bg-background border border-foreground/10 focus:border-foreground/30 focus:outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 rounded-lg bg-background border border-foreground/10 focus:border-foreground/30 focus:outline-none transition-colors"
                  placeholder="Your email"
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                className="w-full px-4 py-3 rounded-lg bg-background border border-foreground/10 focus:border-foreground/30 focus:outline-none transition-colors"
                placeholder="Subject of your message"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message
              </label>
              <textarea
                id="message"
                rows={6}
                className="w-full px-4 py-3 rounded-lg bg-background border border-foreground/10 focus:border-foreground/30 focus:outline-none transition-colors"
                placeholder="Your message"
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                className="px-8 py-3 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 font-medium"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Back to Home */}
      <div className="max-w-4xl mx-auto mt-16 text-center">
        <Link 
          href="/" 
          className="inline-flex items-center text-lg font-medium hover:underline underline-offset-4"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="w-5 h-5 mr-1"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
}