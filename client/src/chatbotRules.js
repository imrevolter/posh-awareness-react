const rules = [
  {
    keywords: ['anonymous', 'anonymously', 'anonymity'],
    reply: 'Yes, you can submit a complaint anonymously by checking the "Submit anonymously" box on the complaint form. Your name and email will not be recorded.'
  },
  {
    keywords: ['confidential', 'confidentiality', 'privacy', 'private'],
    reply: 'Yes. The POSH Act requires that the identity of the complainant, the respondent, and all proceedings remain strictly confidential throughout the process.'
  },
  {
    keywords: ['time limit', 'deadline', 'how long', 'within how many', 'time frame', 'months'],
    reply: 'A complaint must generally be filed within 3 months of the incident. The ICC can extend this in certain circumstances.'
  },
  {
    keywords: ['types of harassment', 'what counts as harassment', 'what is harassment', 'examples of harassment', 'kinds of harassment'],
    reply: 'Harassment covered under POSH includes verbal, physical, online, and hostile-environment harassment: unwelcome physical contact, sexual remarks, showing explicit content, and creating an intimidating or offensive environment.'
  },
  {
    keywords: ['punishment', 'action taken', 'consequence', 'penalty', 'disciplinary'],
    reply: "If harassment is proven after investigation, the ICC can recommend disciplinary action against the offender, as per the institution's policy and the POSH Act."
  },
  {
    keywords: ['track', 'status', 'update on my complaint'],
    reply: "Complaint status isn't shown publicly, to protect confidentiality. Please contact the ICC directly with your Complaint ID for an update."
  },
  {
    keywords: ['icc', 'committee', 'members', 'who is on'],
    reply: 'The Internal Complaints Committee (ICC) includes a Presiding Officer, Faculty Member, External Member, Staff Representative, and Student Representative. See the "ICC" page for names and photos.'
  },
  {
    keywords: ['posh act', 'posh', 'what is posh'],
    reply: 'The POSH Act, 2013 (Prevention of Sexual Harassment at Workplace Act) protects women from sexual harassment at workplaces and educational institutions, and requires every institution to set up an Internal Complaints Committee (ICC).'
  },
  {
    keywords: ['file a complaint', 'file complaint', 'lodge a complaint', 'how do i complain', 'how to complain', 'complain', 'report an incident'],
    reply: 'You can file a complaint using the "Report an Incident" form on the home page. You can choose to submit it anonymously. After submitting, you will receive a Complaint ID, keep it safe, as it is the only way to reference your complaint later.'
  },
  {
    keywords: ['thank', 'thanks', 'bye', 'goodbye'],
    reply: "You're welcome. Stay safe, and don't hesitate to reach out to the ICC if you need help."
  },
  {
    keywords: ['hello', 'hi', 'hey'],
    reply: "Hello! I'm the SafeCampus assistant. I can help with the POSH Act, filing a complaint, the ICC, confidentiality, and timelines. What would you like to know?"
  }
]

const fallback = 'I can help with the POSH Act, filing a complaint, the ICC, confidentiality, and timelines. Could you rephrase your question, or reach out to the ICC directly through the "ICC" page?'

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function getBotReply(message) {
  const text = message.toLowerCase()
  for (const rule of rules) {
    if (rule.keywords.some(k => new RegExp(`\\b${escapeRegex(k)}\\b`).test(text))) {
      return rule.reply
    }
  }
  return fallback
}
