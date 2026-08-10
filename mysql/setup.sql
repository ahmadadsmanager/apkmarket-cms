SET NAMES utf8mb4;
CREATE TABLE IF NOT EXISTS categories (
 id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(120) NOT NULL,
 slug VARCHAR(140) NOT NULL UNIQUE,
 description TEXT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS apps (
 id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 title VARCHAR(180) NOT NULL,
 slug VARCHAR(200) NOT NULL UNIQUE,
 short_description TEXT NULL,
 developer VARCHAR(160) NULL,
 category_id INT UNSIGNED NULL,
 app_type ENUM('app','game') DEFAULT 'app',
 version VARCHAR(80) NULL,
 android_required VARCHAR(80) NULL,
 size VARCHAR(80) NULL,
 rating DECIMAL(2,1) DEFAULT 0,
 downloads BIGINT UNSIGNED DEFAULT 0,
 icon_url TEXT NULL,
 featured_image TEXT NULL,
 screenshots JSON NULL,
 apk_url TEXT NULL,
 mod_info TEXT NULL,
 features JSON NULL,
 specifications JSON NULL,
 content_html LONGTEXT NULL,
 schema_json JSON NULL,
 seo_title VARCHAR(255) NULL,
 meta_description TEXT NULL,
 canonical_url TEXT NULL,
 robots VARCHAR(40) DEFAULT 'index,follow',
 status ENUM('draft','published') DEFAULT 'draft',
 featured TINYINT(1) DEFAULT 0,
 trending TINYINT(1) DEFAULT 0,
 created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
 updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 INDEX(category_id), INDEX(status), INDEX(featured), INDEX(trending),
 CONSTRAINT fk_apps_category FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS pages (
 id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 title VARCHAR(180) NOT NULL,
 slug VARCHAR(180) NOT NULL UNIQUE,
 content_html LONGTEXT NULL,
 seo_title VARCHAR(255) NULL,
 meta_description TEXT NULL,
 status ENUM('draft','published') DEFAULT 'published',
 created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
 updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contacts (
 id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(160) NOT NULL,
 email VARCHAR(190) NOT NULL,
 subject VARCHAR(255) NULL,
 message TEXT NOT NULL,
 is_read TINYINT(1) DEFAULT 0,
 created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS settings (
 id INT UNSIGNED PRIMARY KEY,
 site_name VARCHAR(160) DEFAULT 'APKMarket',
 site_tagline VARCHAR(255) NULL,
 notification_email VARCHAR(190) NULL,
 from_name VARCHAR(160) NULL,
 smtp_host VARCHAR(190) NULL,
 smtp_port INT DEFAULT 465,
 smtp_secure TINYINT(1) DEFAULT 1,
 smtp_user VARCHAR(190) NULL,
 smtp_password_encrypted TEXT NULL,
 updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO settings(id,site_name,site_tagline,smtp_host,smtp_port,smtp_secure) VALUES(1,'APKMarket','Discover apps & games','smtp.gmail.com',465,1);
INSERT IGNORE INTO categories(name,slug,description) VALUES
('Tools','tools','Utility and productivity apps'),('Entertainment','entertainment','Streaming and entertainment apps'),('Games','games','Android games'),('Photography','photography','Photo and video tools');
INSERT IGNORE INTO pages(title,slug,content_html,status) VALUES
('About Us','about-us','<h1>About APKMarket</h1><p>Use this page to describe your website.</p>','published'),
('Privacy Policy','privacy-policy','<h1>Privacy Policy</h1><p>Replace this demo policy before launch.</p>','published'),
('Terms & Conditions','terms','<h1>Terms & Conditions</h1><p>Replace this demo content before launch.</p>','published'),
('DMCA / Copyright','dmca','<h1>DMCA / Copyright</h1><p>Add your copyright and takedown procedure here.</p>','published'),
('Disclaimer','disclaimer','<h1>Disclaimer</h1><p>Add your website disclaimer here.</p>','published');
