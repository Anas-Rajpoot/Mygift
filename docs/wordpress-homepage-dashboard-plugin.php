<?php
/**
 * Plugin Name: MyGift Homepage Dashboard
 * Description: Adds a single WordPress dashboard page for homepage settings and exposes them via REST API.
 * Version: 1.0.0
 * Author: MyGift
 */

if (!defined('ABSPATH')) {
  exit;
}

class MyGift_Homepage_Dashboard {
  const OPTION_KEY = 'mygift_homepage_settings';

  public function __construct() {
    add_action('admin_menu', [$this, 'add_admin_menu']);
    add_action('admin_init', [$this, 'register_settings']);
    add_action('rest_api_init', [$this, 'register_rest_routes']);
  }

  public function add_admin_menu() {
    add_menu_page(
      'Homepage Dashboard',
      'Homepage Dashboard',
      'manage_options',
      'mygift-homepage-dashboard',
      [$this, 'render_admin_page'],
      'dashicons-welcome-widgets-menus',
      56
    );
  }

  public function register_settings() {
    register_setting('mygift_homepage_group', self::OPTION_KEY);
  }

  public function get_settings() {
    $defaults = [
      'new_in_title' => 'New In',
      'new_in_subtitle' => 'Latest Arrivals',
      'top_sale_heading' => 'Limited Deals',
      'top_sale_subtitle' => '',
      'top_sale_product_slugs' => '',

      // Promo strip (3 items)
      'promo_strip_1' => 'Same-day delivery',
      'promo_strip_2' => 'Easy returns',
      'promo_strip_3' => 'Secure checkout',

      // Marquee (one item per line)
      'marquee_items' => "Same-day delivery\nKarachi\nLahore\nIslamabad\nMultan\nInternational orders welcome\nJazzCash\nEasyPaisa\nCards accepted",

      // Trust bar (one item per line: headline|description)
      'trust_items' => "Same-Day Delivery|Order before 2pm for same-day delivery in major cities\nShip Worldwide|Order from anywhere, we deliver across Pakistan\nPremium Quality|Hand-picked products with quality guarantee\n24/7 Support|Reach us anytime via WhatsApp or email",

      // Diaspora section
      'diaspora_eyebrow' => 'For the Diaspora',
      'diaspora_title' => 'Send your love home to Pakistan',
      'diaspora_body' => 'Living in the UK? USA? UAE? Order in minutes, pay in your currency. We deliver to your family in Pakistan.',
      'diaspora_cta_label' => 'Send a Gift to Pakistan',
      'diaspora_cta_href' => '/send-to-pakistan',

      // GiftLab section
      'giftlab_eyebrow' => 'Exclusive',
      'giftlab_title' => 'GiftLab',
      'giftlab_description' => 'Design your perfect gift. Choose a box, pick items, add a ribbon and personal message.',
      'giftlab_cta_label' => 'Start Creating',
      'giftlab_cta_href' => '/giftlab',

      // Occasions grid (one line: name|count|href|bgColor)
      'occasions_items' => "Birthday|86|/shop/occasions/birthday|#4a1525\nAnniversary|42|/shop/occasions/anniversary|#241318\nWedding|64|/shop/occasions/wedding|#3d1120\nEid|78|/shop/occasions/eid|#1f1015\nMother's Day|35|/shop/occasions/mothers-day|#1a0c10\nValentine's Day|54|/shop/occasions/valentines|#4a1525",
    ];

    for ($i = 1; $i <= 3; $i++) {
      $defaults["hero_{$i}_eyebrow"] = '';
      $defaults["hero_{$i}_title"] = '';
      $defaults["hero_{$i}_subtitle"] = '';
      $defaults["hero_{$i}_cta_label"] = '';
      $defaults["hero_{$i}_cta_href"] = '';
      $defaults["hero_{$i}_image_url"] = '';
      $defaults["hero_{$i}_image_alt"] = '';
    }

    $saved = get_option(self::OPTION_KEY, []);
    if (!is_array($saved)) {
      $saved = [];
    }

    return array_merge($defaults, $saved);
  }

  public function render_admin_page() {
    if (!current_user_can('manage_options')) {
      return;
    }

    $settings = $this->get_settings();

    // Needed for wp.media media picker
    if (function_exists('wp_enqueue_media')) {
      wp_enqueue_media();
    }
    ?>
    <div class="wrap">
      <h1>Homepage Dashboard</h1>
      <p>Manage homepage content in one place. Save and your Next.js homepage updates automatically.</p>

      <form method="post" action="options.php">
        <?php settings_fields('mygift_homepage_group'); ?>
        <?php $key = self::OPTION_KEY; ?>

        <h2>New In Carousel</h2>
        <table class="form-table">
          <tr>
            <th><label>Section Eyebrow</label></th>
            <td><input type="text" class="regular-text" name="<?php echo esc_attr($key); ?>[new_in_title]" value="<?php echo esc_attr($settings['new_in_title']); ?>" /></td>
          </tr>
          <tr>
            <th><label>Section Heading</label></th>
            <td><input type="text" class="regular-text" name="<?php echo esc_attr($key); ?>[new_in_subtitle]" value="<?php echo esc_attr($settings['new_in_subtitle']); ?>" /></td>
          </tr>
        </table>

        <h2>Top Sale Section</h2>
        <table class="form-table">
          <tr>
            <th><label>Heading</label></th>
            <td><input type="text" class="regular-text" name="<?php echo esc_attr($key); ?>[top_sale_heading]" value="<?php echo esc_attr($settings['top_sale_heading']); ?>" /></td>
          </tr>
          <tr>
            <th><label>Subtitle</label></th>
            <td><input type="text" class="regular-text" name="<?php echo esc_attr($key); ?>[top_sale_subtitle]" value="<?php echo esc_attr($settings['top_sale_subtitle']); ?>" /></td>
          </tr>
          <tr>
            <th><label>Product slugs</label></th>
            <td>
              <textarea class="large-text" rows="3" name="<?php echo esc_attr($key); ?>[top_sale_product_slugs]"><?php echo esc_textarea($settings['top_sale_product_slugs']); ?></textarea>
              <p class="description">Comma separated (example: gift-box-red, premium-cake, rose-bundle)</p>
            </td>
          </tr>
        </table>

        <h2>Promo Strip</h2>
        <table class="form-table">
          <tr>
            <th><label>Item 1</label></th>
            <td><input type="text" class="regular-text" name="<?php echo esc_attr($key); ?>[promo_strip_1]" value="<?php echo esc_attr($settings['promo_strip_1']); ?>" /></td>
          </tr>
          <tr>
            <th><label>Item 2</label></th>
            <td><input type="text" class="regular-text" name="<?php echo esc_attr($key); ?>[promo_strip_2]" value="<?php echo esc_attr($settings['promo_strip_2']); ?>" /></td>
          </tr>
          <tr>
            <th><label>Item 3</label></th>
            <td><input type="text" class="regular-text" name="<?php echo esc_attr($key); ?>[promo_strip_3]" value="<?php echo esc_attr($settings['promo_strip_3']); ?>" /></td>
          </tr>
        </table>

        <h2>Marquee Items</h2>
        <textarea class="large-text" rows="6" name="<?php echo esc_attr($key); ?>[marquee_items]"><?php echo esc_textarea($settings['marquee_items']); ?></textarea>
        <p class="description">One item per line.</p>

        <h2>Trust Bar Items</h2>
        <textarea class="large-text" rows="6" name="<?php echo esc_attr($key); ?>[trust_items]"><?php echo esc_textarea($settings['trust_items']); ?></textarea>
        <p class="description">One item per line: <code>Headline|Description</code>. Add 4 lines.</p>

        <h2>Diaspora Section</h2>
        <table class="form-table">
          <tr><th><label>Eyebrow</label></th><td><input type="text" class="regular-text" name="<?php echo esc_attr($key); ?>[diaspora_eyebrow]" value="<?php echo esc_attr($settings['diaspora_eyebrow']); ?>" /></td></tr>
          <tr><th><label>Title</label></th><td><input type="text" class="regular-text" name="<?php echo esc_attr($key); ?>[diaspora_title]" value="<?php echo esc_attr($settings['diaspora_title']); ?>" /></td></tr>
          <tr><th><label>Body</label></th><td><textarea class="large-text" rows="3" name="<?php echo esc_attr($key); ?>[diaspora_body]"><?php echo esc_textarea($settings['diaspora_body']); ?></textarea></td></tr>
          <tr><th><label>CTA Label</label></th><td><input type="text" class="regular-text" name="<?php echo esc_attr($key); ?>[diaspora_cta_label]" value="<?php echo esc_attr($settings['diaspora_cta_label']); ?>" /></td></tr>
          <tr><th><label>CTA URL</label></th><td><input type="text" class="regular-text" name="<?php echo esc_attr($key); ?>[diaspora_cta_href]" value="<?php echo esc_attr($settings['diaspora_cta_href']); ?>" /></td></tr>
        </table>

        <h2>GiftLab Section</h2>
        <table class="form-table">
          <tr><th><label>Eyebrow</label></th><td><input type="text" class="regular-text" name="<?php echo esc_attr($key); ?>[giftlab_eyebrow]" value="<?php echo esc_attr($settings['giftlab_eyebrow']); ?>" /></td></tr>
          <tr><th><label>Title</label></th><td><input type="text" class="regular-text" name="<?php echo esc_attr($key); ?>[giftlab_title]" value="<?php echo esc_attr($settings['giftlab_title']); ?>" /></td></tr>
          <tr><th><label>Description</label></th><td><textarea class="large-text" rows="3" name="<?php echo esc_attr($key); ?>[giftlab_description]"><?php echo esc_textarea($settings['giftlab_description']); ?></textarea></td></tr>
          <tr><th><label>CTA Label</label></th><td><input type="text" class="regular-text" name="<?php echo esc_attr($key); ?>[giftlab_cta_label]" value="<?php echo esc_attr($settings['giftlab_cta_label']); ?>" /></td></tr>
          <tr><th><label>CTA URL</label></th><td><input type="text" class="regular-text" name="<?php echo esc_attr($key); ?>[giftlab_cta_href]" value="<?php echo esc_attr($settings['giftlab_cta_href']); ?>" /></td></tr>
        </table>

        <h2>Occasions Grid</h2>
        <textarea class="large-text" rows="7" name="<?php echo esc_attr($key); ?>[occasions_items]"><?php echo esc_textarea($settings['occasions_items']); ?></textarea>
        <p class="description">One line: <code>name|count|href|bgColor</code>. Add 6 lines.</p>

        <h2>Hero Banner Slides</h2>
        <p>Configure up to 3 slides.</p>
        <?php for ($i = 1; $i <= 3; $i++): ?>
          <h3>Slide <?php echo intval($i); ?></h3>
          <table class="form-table">
            <tr>
              <th><label>Eyebrow</label></th>
              <td><input type="text" class="regular-text" name="<?php echo esc_attr($key); ?>[hero_<?php echo intval($i); ?>_eyebrow]" value="<?php echo esc_attr($settings["hero_{$i}_eyebrow"]); ?>" /></td>
            </tr>
            <tr>
              <th><label>Title</label></th>
              <td><input type="text" class="regular-text" name="<?php echo esc_attr($key); ?>[hero_<?php echo intval($i); ?>_title]" value="<?php echo esc_attr($settings["hero_{$i}_title"]); ?>" /></td>
            </tr>
            <tr>
              <th><label>Subtitle</label></th>
              <td><textarea class="large-text" rows="2" name="<?php echo esc_attr($key); ?>[hero_<?php echo intval($i); ?>_subtitle]"><?php echo esc_textarea($settings["hero_{$i}_subtitle"]); ?></textarea></td>
            </tr>
            <tr>
              <th><label>CTA Label</label></th>
              <td><input type="text" class="regular-text" name="<?php echo esc_attr($key); ?>[hero_<?php echo intval($i); ?>_cta_label]" value="<?php echo esc_attr($settings["hero_{$i}_cta_label"]); ?>" /></td>
            </tr>
            <tr>
              <th><label>CTA URL</label></th>
              <td><input type="text" class="regular-text" name="<?php echo esc_attr($key); ?>[hero_<?php echo intval($i); ?>_cta_href]" value="<?php echo esc_attr($settings["hero_{$i}_cta_href"]); ?>" /></td>
            </tr>
            <tr>
              <th><label>Image URL</label></th>
              <td>
                <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                  <input
                    id="mygift-hero-<?php echo intval($i); ?>-image-url"
                    type="text"
                    class="large-text"
                    name="<?php echo esc_attr($key); ?>[hero_<?php echo intval($i); ?>_image_url]"
                    value="<?php echo esc_attr($settings["hero_{$i}_image_url"]); ?>"
                  />
                  <button
                    type="button"
                    class="button mygift-select-hero-image"
                    data-url-target="mygift-hero-<?php echo intval($i); ?>-image-url"
                    data-alt-target="mygift-hero-<?php echo intval($i); ?>-image-alt"
                  >
                    Select Image
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <th><label>Image Alt</label></th>
              <td>
                <input
                  id="mygift-hero-<?php echo intval($i); ?>-image-alt"
                  type="text"
                  class="regular-text"
                  name="<?php echo esc_attr($key); ?>[hero_<?php echo intval($i); ?>_image_alt]"
                  value="<?php echo esc_attr($settings["hero_{$i}_image_alt"]); ?>"
                />
              </td>
            </tr>
          </table>
          <hr />
        <?php endfor; ?>

        <?php submit_button('Save Homepage Settings'); ?>
      </form>
    </div>

    <script>
      (function() {
        function initMyGiftHeroMediaPickers() {
          var buttons = document.querySelectorAll('.mygift-select-hero-image');
          if (!buttons.length || typeof wp === 'undefined' || !wp.media) return;

          buttons.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
              e.preventDefault();

              var urlTarget = btn.getAttribute('data-url-target');
              var altTarget = btn.getAttribute('data-alt-target');

              var frame = wp.media({
                title: 'Select Hero Image',
                button: { text: 'Use this image' },
                multiple: false
              });

              frame.on('select', function() {
                var attachment = frame.state().get('selection').first().toJSON();
                var url = attachment.url || '';
                var alt = attachment.alt || attachment.title || '';

                var urlEl = document.getElementById(urlTarget);
                var altEl = document.getElementById(altTarget);

                if (urlEl) urlEl.value = url;
                if (altEl) altEl.value = alt;
              });

              frame.open();
            });
          });
        }

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', initMyGiftHeroMediaPickers);
        } else {
          initMyGiftHeroMediaPickers();
        }
      })();
    </script>
    <?php
  }

  public function register_rest_routes() {
    register_rest_route('mygift/v1', '/homepage-settings', [
      'methods' => 'GET',
      'callback' => [$this, 'rest_get_homepage_settings'],
      'permission_callback' => '__return_true',
    ]);
  }

  public function rest_get_homepage_settings() {
    $s = $this->get_settings();

    $hero_slides = [];
    for ($i = 1; $i <= 3; $i++) {
      $hero_slides[] = [
        'eyebrow' => sanitize_text_field($s["hero_{$i}_eyebrow"]),
        'title' => sanitize_text_field($s["hero_{$i}_title"]),
        'subtitle' => sanitize_text_field($s["hero_{$i}_subtitle"]),
        'ctaLabel' => sanitize_text_field($s["hero_{$i}_cta_label"]),
        'ctaHref' => esc_url_raw($s["hero_{$i}_cta_href"]),
        'imageUrl' => esc_url_raw($s["hero_{$i}_image_url"]),
        'imageAlt' => sanitize_text_field($s["hero_{$i}_image_alt"]),
      ];
    }

    $slugs = array_values(array_filter(array_map('trim', explode(',', (string) $s['top_sale_product_slugs']))));

    $promoStripItems = [
      sanitize_text_field($s['promo_strip_1']),
      sanitize_text_field($s['promo_strip_2']),
      sanitize_text_field($s['promo_strip_3']),
    ];

    $marqueeLines = preg_split("/\r\n|\n|\r/", (string) $s['marquee_items']);
    $marqueeItems = array_values(array_filter(array_map('trim', $marqueeLines)));

    $trustLines = preg_split("/\r\n|\n|\r/", (string) $s['trust_items']);
    $trustBarItems = [];
    foreach ($trustLines as $line) {
      $line = trim((string) $line);
      if ($line === '') continue;
      $parts = explode('|', $line, 2);
      $headline = isset($parts[0]) ? sanitize_text_field($parts[0]) : '';
      $description = isset($parts[1]) ? sanitize_text_field($parts[1]) : '';
      if ($headline !== '' && $description !== '') {
        $trustBarItems[] = [
          'headline' => $headline,
          'description' => $description,
        ];
      }
    }

    $diaspora = [
      'eyebrow' => sanitize_text_field($s['diaspora_eyebrow']),
      'title' => sanitize_text_field($s['diaspora_title']),
      'body' => sanitize_text_field($s['diaspora_body']),
      'ctaLabel' => sanitize_text_field($s['diaspora_cta_label']),
      'ctaHref' => esc_url_raw($s['diaspora_cta_href']),
    ];

    $giftlab = [
      'eyebrow' => sanitize_text_field($s['giftlab_eyebrow']),
      'title' => sanitize_text_field($s['giftlab_title']),
      'description' => sanitize_text_field($s['giftlab_description']),
      'ctaLabel' => sanitize_text_field($s['giftlab_cta_label']),
      'ctaHref' => esc_url_raw($s['giftlab_cta_href']),
    ];

    $occasionsLines = preg_split("/\r\n|\n|\r/", (string) $s['occasions_items']);
    $occasionsGrid = [];
    foreach ($occasionsLines as $line) {
      $line = trim((string) $line);
      if ($line === '') continue;
      $parts = explode('|', $line, 4);
      $name = isset($parts[0]) ? sanitize_text_field($parts[0]) : '';
      $countRaw = isset($parts[1]) ? trim((string) $parts[1]) : '';
      $count = is_numeric($countRaw) ? intval($countRaw) : 0;
      $href = isset($parts[2]) ? esc_url_raw($parts[2]) : '';
      $bg = isset($parts[3]) ? sanitize_text_field($parts[3]) : '';

      if ($name !== '' && $href !== '') {
        $occasionsGrid[] = [
          'name' => $name,
          'count' => $count,
          'href' => $href,
          'bg' => $bg,
        ];
      }
    }

    return [
      'heroSlides' => $hero_slides,
      'topSaleHeading' => sanitize_text_field($s['top_sale_heading']),
      'topSaleSubtitle' => sanitize_text_field($s['top_sale_subtitle']),
      'topSaleProductSlugs' => $slugs,
      'newInTitle' => sanitize_text_field($s['new_in_title']),
      'newInSubtitle' => sanitize_text_field($s['new_in_subtitle']),

      'promoStripItems' => $promoStripItems,
      'marqueeItems' => $marqueeItems,
      'trustBarItems' => $trustBarItems,
      'diaspora' => $diaspora,
      'giftlab' => $giftlab,
      'occasionsGrid' => $occasionsGrid,
    ];
  }
}

new MyGift_Homepage_Dashboard();

