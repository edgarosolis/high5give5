export default function GuidePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Guide</h1>
      <p className="text-gray-500 mb-8">
        Step-by-step instructions for managing country profiles and blog posts.
      </p>

      {/* Table of Contents */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Table of Contents</h2>
        <ol className="list-decimal list-inside space-y-2 text-[#2A9D8F]">
          <li><a href="#login" className="hover:underline">Logging In</a></li>
          <li><a href="#dashboard" className="hover:underline">The Dashboard</a></li>
          <li><a href="#country" className="hover:underline">Updating a Country Profile</a></li>
          <li><a href="#blog" className="hover:underline">Creating a Blog Post</a></li>
          <li><a href="#editor" className="hover:underline">Using the Text Editor</a></li>
          <li><a href="#images" className="hover:underline">Uploading Images</a></li>
          <li><a href="#website" className="hover:underline">How Changes Appear on the Website</a></li>
        </ol>
      </div>

      {/* ════════════════════════════════════ */}
      <section id="login" className="mb-12">
        <h2 className="text-xl font-bold text-[#264653] mb-4 border-l-4 border-[#2A9D8F] pl-4">
          1. Logging In
        </h2>
        <div className="space-y-3">
          <Step n={1}>
            Open your browser and go to: <strong>https://main.drbzvk9g92ros.amplifyapp.com/admin</strong>
          </Step>
          <Step n={2}>
            You will see the login screen with the <strong>HIGH5GIVE5</strong> logo and a password field.
          </Step>
          <Step n={3}>
            Enter the admin password and click <strong>Sign In</strong>.
          </Step>
          <Step n={4}>
            You will be taken to the Dashboard.
          </Step>
        </div>
        <Tip>If you see &quot;Invalid password&quot;, double-check the password. Contact your administrator if you need the current password.</Tip>
      </section>

      {/* ════════════════════════════════════ */}
      <section id="dashboard" className="mb-12">
        <h2 className="text-xl font-bold text-[#264653] mb-4 border-l-4 border-[#2A9D8F] pl-4">
          2. The Dashboard
        </h2>
        <p className="mb-4">After logging in, you will see the main Dashboard with a sidebar menu on the left and quick action cards in the center.</p>

        <h3 className="font-semibold text-gray-900 mb-2">Sidebar Menu</h3>
        <Table
          headers={["Menu Item", "What It Does"]}
          rows={[
            ["Dashboard", "Overview with status and quick actions"],
            ["Global Stats", "Update the impact numbers (countries, children, elderly)"],
            ["Homepage", "Edit the hero banner, story section, and video"],
            ["Countries", "Manage all country profiles"],
            ["Blog Posts", "Create and edit blog posts"],
            ["About Page", "Edit the founding story and timeline"],
            ["Contact Info", "Update contact details and social links"],
            ["Guide", "This page — how to use the admin"],
            ["View Site", "Opens the public website in a new tab"],
            ["Logout", "Sign out of the admin"],
          ]}
        />
      </section>

      {/* ════════════════════════════════════ */}
      <section id="country" className="mb-12">
        <h2 className="text-xl font-bold text-[#264653] mb-4 border-l-4 border-[#2A9D8F] pl-4">
          3. Updating a Country Profile
        </h2>

        <h3 className="font-semibold text-gray-900 mt-6 mb-2">Step 1: Go to Countries</h3>
        <p className="mb-3">Click <strong>Countries</strong> in the sidebar. You will see a table listing all country profiles with their name, region, project type, children fed, partner, and status.</p>
        <Tip>Use the search bar to quickly find a country by name, or use the region dropdown to filter.</Tip>

        <h3 className="font-semibold text-gray-900 mt-6 mb-2">Step 2: Click Edit</h3>
        <p className="mb-3">Find the country you want to update and click <strong>Edit</strong> in the Actions column.</p>

        <h3 className="font-semibold text-gray-900 mt-6 mb-2">Step 3: Fill in the Form</h3>
        <p className="mb-4">The country form has these sections from top to bottom:</p>

        <FormSection title="Country Info">
          <FieldDesc name="Name" required>The country name as it appears on the website.</FieldDesc>
          <FieldDesc name="Tagline">A short phrase shown under the country name. Example: &quot;Bringing hope to families in need&quot;.</FieldDesc>
        </FormSection>

        <FormSection title="Project Details">
          <FieldDesc name="Slug" required>The URL-friendly name (auto-generated, do not change).</FieldDesc>
          <FieldDesc name="Project Type" required>e.g., &quot;Feeding&quot;, &quot;Water &amp; Well&quot;, &quot;School Supplies&quot;.</FieldDesc>
          <FieldDesc name="Region" required>Select from Europe, Americas, Africa, Asia, or Middle East.</FieldDesc>
          <FieldDesc name="Partner Organization">The name of the local partner (optional).</FieldDesc>
        </FormSection>

        <FormSection title="Hero Image">
          <p className="text-sm text-gray-600">
            The main photo at the top of the country page. Drag and drop an image, click &quot;click to browse&quot;, or paste an image URL. Formats: JPEG, PNG, WebP, GIF. Max 10MB.
          </p>
        </FormSection>

        <FormSection title="Project Introduction">
          <p className="text-sm text-gray-600">
            A short introduction shown at the top of the country page and on country cards. Uses the <strong>rich text editor</strong> — what you type here looks the same on the website.
          </p>
        </FormSection>

        <FormSection title="Impact Stats">
          <FieldDesc name="Meals per $5">How many meals each $5 provides.</FieldDesc>
          <FieldDesc name="Children Currently Fed">Number of children being fed.</FieldDesc>
        </FormSection>

        <FormSection title="Project Description">
          <p className="text-sm text-gray-600">
            The longer, detailed story about the project. Use the rich text editor to add headings, paragraphs, bullet lists, and more. Appears below the impact stats.
          </p>
        </FormSection>

        <FormSection title="Map Location">
          <p className="text-sm text-gray-600">
            Type a city or country name (e.g., &quot;Tirana, Albania&quot;) and click <strong>Find</strong>. The system automatically finds the coordinates.
          </p>
        </FormSection>

        <h3 className="font-semibold text-gray-900 mt-6 mb-2">Step 4: Save</h3>
        <Step n={4}>Click the green <strong>Save Changes</strong> button. You will see a green &quot;Country saved!&quot; message if successful.</Step>

        <h3 className="font-semibold text-gray-900 mt-6 mb-2">Step 5: Verify</h3>
        <Step n={5}>Click <strong>&quot;View on Site&quot;</strong> next to the Save button to see your changes live.</Step>

        <h3 className="font-semibold text-gray-900 mt-6 mb-2">Archiving a Country</h3>
        <p className="mb-2">To temporarily hide a country from the website without deleting it:</p>
        <ol className="list-decimal list-inside space-y-1 text-gray-700 ml-2">
          <li>Go to <strong>Countries</strong> in the sidebar.</li>
          <li>Click <strong>Archive</strong> next to the country.</li>
          <li>The status changes to <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-500">Archived</span> and the country disappears from the public website.</li>
          <li>To bring it back, click <strong>Restore</strong>.</li>
        </ol>
      </section>

      {/* ════════════════════════════════════ */}
      <section id="blog" className="mb-12">
        <h2 className="text-xl font-bold text-[#264653] mb-4 border-l-4 border-[#2A9D8F] pl-4">
          4. Creating a Blog Post
        </h2>

        <h3 className="font-semibold text-gray-900 mt-4 mb-2">Step 1: Go to Blog Posts</h3>
        <p className="mb-3">Click <strong>Blog Posts</strong> in the sidebar.</p>

        <h3 className="font-semibold text-gray-900 mt-4 mb-2">Step 2: Click + New Post</h3>
        <p className="mb-3">Click the <strong>+ New Post</strong> button in the top-right corner.</p>

        <h3 className="font-semibold text-gray-900 mt-4 mb-2">Step 3: Fill in the Form</h3>

        <FormSection title="Post Details">
          <FieldDesc name="Title" required>The headline of the blog post.</FieldDesc>
          <FieldDesc name="Slug" required>Auto-generated from the title (do not change).</FieldDesc>
          <FieldDesc name="Country" required>Select which country this post is about.</FieldDesc>
          <FieldDesc name="Publish Date" required>The date shown on the post. Defaults to today.</FieldDesc>
        </FormSection>

        <FormSection title="Content">
          <p className="text-sm text-gray-600">
            The body of the blog post. Uses the <strong>rich text editor</strong>. Write with formatting, headings, bold text, lists, etc. What you write is exactly how it appears on the website.
          </p>
        </FormSection>

        <FormSection title="Hero Image">
          <p className="text-sm text-gray-600">
            The main banner image at the top of the blog post. Also used as the thumbnail on the blog listing page. Drag and drop or click to browse.
          </p>
        </FormSection>

        <FormSection title="Photos">
          <p className="text-sm text-gray-600">
            Additional images displayed in a <strong>3D photo carousel</strong> below the blog text. You can upload multiple photos at once. Hover over photos to reorder or remove them.
          </p>
        </FormSection>

        <FormSection title="Video">
          <FieldDesc name="YouTube Video URL">Paste a YouTube link (optional). A preview will appear and the video will be embedded in the post.</FieldDesc>
        </FormSection>

        <FormSection title="Publishing">
          <FieldDesc name="Post to Facebook">Check this box to automatically create a Facebook post when saving.</FieldDesc>
        </FormSection>

        <h3 className="font-semibold text-gray-900 mt-6 mb-2">Step 4: Save</h3>
        <Step n={4}>Click the green <strong>Save Changes</strong> button.</Step>

        <h3 className="font-semibold text-gray-900 mt-6 mb-2">Step 5: View the Post</h3>
        <Step n={5}>Click <strong>&quot;View Post&quot;</strong> to see it live. The post appears on the Blog page as a card, and clicking it opens the full post.</Step>

        <p className="mt-4">On the website, the blog post shows in this order:</p>
        <ol className="list-decimal list-inside space-y-1 text-gray-700 ml-2">
          <li>Hero image (large banner at the top)</li>
          <li>Blog text (your content from the editor)</li>
          <li>Photo carousel (swipe through additional photos)</li>
          <li>YouTube video (if provided)</li>
          <li>Donate call-to-action</li>
        </ol>
      </section>

      {/* ════════════════════════════════════ */}
      <section id="editor" className="mb-12">
        <h2 className="text-xl font-bold text-[#264653] mb-4 border-l-4 border-[#2A9D8F] pl-4">
          5. Using the Text Editor
        </h2>
        <p className="mb-4">The text editor is used for Project Introduction, Project Description (countries), and Blog Content. It works like a simple word processor.</p>

        <h3 className="font-semibold text-gray-900 mb-3">The Toolbar</h3>
        <div className="flex flex-wrap items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-2 mb-4">
          {["H2", "H3"].map((b) => (
            <span key={b} className="px-2 py-1 border border-gray-300 rounded text-sm bg-white">{b}</span>
          ))}
          <span className="w-px h-5 bg-gray-300 mx-1" />
          <span className="px-2 py-1 border border-gray-300 rounded text-sm bg-white font-bold">B</span>
          <span className="px-2 py-1 border border-gray-300 rounded text-sm bg-white italic">I</span>
          <span className="px-2 py-1 border border-gray-300 rounded text-sm bg-white underline">U</span>
          <span className="w-px h-5 bg-gray-300 mx-1" />
          <span className="px-2 py-1 border border-gray-300 rounded text-sm bg-white">&#8226; List</span>
          <span className="px-2 py-1 border border-gray-300 rounded text-sm bg-white">1. List</span>
          <span className="w-px h-5 bg-gray-300 mx-1" />
          <span className="px-2 py-1 border border-gray-300 rounded text-sm bg-white">&#128279;</span>
        </div>

        <Table
          headers={["Button", "What It Does"]}
          rows={[
            ["H2", "Creates a large heading (section title)"],
            ["H3", "Creates a smaller heading (subsection)"],
            ["B", "Makes selected text bold"],
            ["I", "Makes selected text italic"],
            ["U", "Makes selected text underlined"],
            ["• List", "Creates a bullet point list"],
            ["1. List", "Creates a numbered list"],
            ["🔗", "Adds a clickable link to selected text"],
          ]}
        />

        <h3 className="font-semibold text-gray-900 mt-6 mb-2">How to Use</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-2">
          <li><strong>Type</strong> your text directly in the editor area.</li>
          <li>To <strong>format text</strong>: select (highlight) the text, then click a toolbar button.</li>
          <li>To <strong>create a heading</strong>: click H2 or H3, type the heading. Click the button again to return to normal text.</li>
          <li>To <strong>create a list</strong>: click the list button and start typing. Press Enter for each new item.</li>
          <li>To <strong>add a link</strong>: select the text, click the link button, type/paste the URL, click OK.</li>
        </ol>

        <Tip>The editor shows exactly how the text will look on the website. Headings appear in the dark navy font, links appear in teal. You do NOT need to know any code.</Tip>
      </section>

      {/* ════════════════════════════════════ */}
      <section id="images" className="mb-12">
        <h2 className="text-xl font-bold text-[#264653] mb-4 border-l-4 border-[#2A9D8F] pl-4">
          6. Uploading Images
        </h2>

        <h3 className="font-semibold text-gray-900 mt-4 mb-2">Single Image (Hero Image, Country Image)</h3>
        <ol className="list-decimal list-inside space-y-1 text-gray-700 ml-2 mb-4">
          <li><strong>Drag and drop</strong> a photo onto the upload area — or click <strong>&quot;click to browse&quot;</strong>.</li>
          <li>Wait for the upload to complete.</li>
          <li>A preview will appear below.</li>
          <li>To change the image, upload a new one.</li>
        </ol>

        <h3 className="font-semibold text-gray-900 mt-4 mb-2">Multiple Images (Blog Photos)</h3>
        <ol className="list-decimal list-inside space-y-1 text-gray-700 ml-2 mb-4">
          <li><strong>Drag and drop</strong> one or more photos — or click to browse and select multiple (hold Ctrl/Cmd).</li>
          <li>Photos upload one at a time (&quot;Uploading 1 of 3...&quot;).</li>
          <li>Uploaded photos appear in a grid above the upload area.</li>
          <li><strong>To reorder</strong>: hover and use the arrow buttons.</li>
          <li><strong>To remove</strong>: hover and click the red X.</li>
        </ol>

        <h3 className="font-semibold text-gray-900 mt-4 mb-2">Image Requirements</h3>
        <Table
          headers={["Setting", "Requirement"]}
          rows={[
            ["Formats", "JPEG, PNG, WebP, GIF"],
            ["Maximum size", "10MB per image"],
            ["Recommended width", "At least 1200px for best quality"],
          ]}
        />
      </section>

      {/* ════════════════════════════════════ */}
      <section id="website" className="mb-12">
        <h2 className="text-xl font-bold text-[#264653] mb-4 border-l-4 border-[#2A9D8F] pl-4">
          7. How Changes Appear on the Website
        </h2>
        <p className="mb-4">All changes are <strong>visible immediately</strong> after saving. There is no delay.</p>

        <h3 className="font-semibold text-gray-900 mt-4 mb-2">Country Profile &rarr; Website</h3>
        <Table
          headers={["What You Edit", "Where It Appears"]}
          rows={[
            ["Name", "Country page hero, Our Work grid card"],
            ["Tagline", "Below the country name on the hero banner"],
            ["Hero Image", "Top of country page, Our Work grid card"],
            ["Project Introduction", "Below hero image on country page"],
            ["Impact Stats", "The two stat boxes (meals, children fed)"],
            ["Project Description", "Detailed content below stats"],
            ["Map Location", "Interactive map on homepage and Our Work"],
          ]}
        />

        <h3 className="font-semibold text-gray-900 mt-4 mb-2">Blog Post &rarr; Website</h3>
        <Table
          headers={["What You Edit", "Where It Appears"]}
          rows={[
            ["Title", "Blog listing card, blog post heading"],
            ["Hero Image", "Blog listing thumbnail, top of post page"],
            ["Content", "Main body of the blog post"],
            ["Photos", "3D photo carousel on blog post"],
            ["YouTube URL", "Embedded video on blog post"],
            ["Publish Date", "Date on blog listing and post"],
            ["Country", "Country tag on listing, link on post"],
          ]}
        />

        <h3 className="font-semibold text-gray-900 mt-4 mb-2">Where to Find Your Content</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
          <li><strong>Country profiles</strong>: Website &rarr; Our Work &rarr; click a country</li>
          <li><strong>Blog posts</strong>: Website &rarr; Blog &rarr; click a post</li>
          <li><strong>Homepage</strong>: Country cards and stats update automatically</li>
        </ul>
      </section>

      {/* ════════════════════════════════════ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-[#264653] mb-4 border-l-4 border-[#2A9D8F] pl-4">
          Quick Reference
        </h2>
        <Table
          headers={["Task", "Where to Go"]}
          rows={[
            ["Edit a country", "Sidebar → Countries → Edit"],
            ["Archive a country", "Sidebar → Countries → Archive"],
            ["Create a blog post", "Sidebar → Blog Posts → + New Post"],
            ["Edit a blog post", "Sidebar → Blog Posts → click post title"],
            ["Update homepage stats", "Sidebar → Global Stats"],
            ["Edit the About page", "Sidebar → About Page"],
            ["Edit the homepage", "Sidebar → Homepage"],
          ]}
        />
      </section>

      <p className="text-center text-gray-400 text-sm border-t border-gray-200 pt-6">
        High5Give5 Admin Guide &mdash; For technical support, contact your website administrator.
      </p>
    </div>
  );
}

/* ─── Helper Components ─── */

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="bg-[#f0fdf9] border border-[#d1fae5] rounded-lg px-5 py-3.5 flex items-start gap-3">
      <span className="flex-shrink-0 w-7 h-7 bg-[#2A9D8F] text-white rounded-full flex items-center justify-center text-sm font-bold">
        {n}
      </span>
      <p className="text-gray-700 text-sm leading-relaxed">{children}</p>
    </div>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg px-5 py-3 mt-3 text-sm text-gray-700">
      <strong className="text-amber-700">Tip: </strong>{children}
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
      <h4 className="font-semibold text-[#264653] text-sm mb-2">{title}</h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function FieldDesc({ name, required, children }: { name: string; required?: boolean; children: React.ReactNode }) {
  return (
    <p className="text-sm text-gray-600">
      <strong className="text-gray-800">{name}</strong>
      {required && <span className="text-red-500 ml-0.5">*</span>}
      {" — "}{children}
    </p>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto mb-4">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="bg-[#264653] text-white text-left py-2.5 px-4 first:rounded-tl-lg last:rounded-tr-lg">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 1 ? "bg-gray-50" : ""}>
              {row.map((cell, j) => (
                <td key={j} className="py-2.5 px-4 border-b border-gray-100 text-gray-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
