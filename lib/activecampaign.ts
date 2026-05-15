if (!process.env.ACTIVECAMPAIGN_API_URL || !process.env.ACTIVECAMPAIGN_API_KEY) {
  console.warn('ActiveCampaign env vars not set — AC integration disabled');
}

const AC_URL = process.env.ACTIVECAMPAIGN_API_URL;
const AC_KEY = process.env.ACTIVECAMPAIGN_API_KEY;

const acFetch = async (endpoint: string, method = 'GET', body?: object) => {
  if (!AC_URL || !AC_KEY) return null;
  try {
    const res = await fetch(`${AC_URL}/api/3/${endpoint}`, {
      method,
      headers: {
        'Api-Token': AC_KEY,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const err = await res.text();
      console.error(`ActiveCampaign error [${endpoint}]:`, err);
      return null;
    }
    return res.json();
  } catch (err) {
    console.error(`ActiveCampaign fetch error [${endpoint}]:`, err);
    return null;
  }
};

export const AC_TAGS = {
  dfy_client: 3,
  diy_individual: 4,
  diy_partner: 5,
  diy_family: 6,
  diy_roe: 7,
  email_course_27day: 8,
  booked_strategy_call: 9,
  booked_consulting_call: 10,
  trust_lead: 11,
  tax_lead: 12,
  dfy_intake_submitted: 13,
  docs_recorded: 14,
  general_lead: 15,
};

export const AC_FIELDS = {
  purchase_type: 5,
  purchase_date: 6,
  case_status: 7,
  sovereign_ledger_url: 8,
};

export const AC_LIST_ID = 3;

export const acUpsertContact = async (params: {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}) => {
  const data = await acFetch('contacts', 'POST', {
    contact: {
      email: params.email,
      firstName: params.firstName || '',
      lastName: params.lastName || '',
      phone: params.phone || '',
    },
  });
  return data?.contact?.id || null;
};

export const acAddToList = async (contactId: string | number) => {
  await acFetch('contactLists', 'POST', {
    contactList: {
      list: AC_LIST_ID,
      contact: contactId,
      status: 1,
    },
  });
};

export const acApplyTag = async (contactId: string | number, tagId: number) => {
  await acFetch('contactTags', 'POST', {
    contactTag: {
      contact: String(contactId),
      tag: String(tagId),
    },
  });
};

export const acSetField = async (
  contactId: string | number,
  fieldId: number,
  value: string
) => {
  await acFetch('fieldValues', 'POST', {
    fieldValue: {
      contact: String(contactId),
      field: String(fieldId),
      value,
    },
    useDefaults: false,
  });
};

export const acTrackEvent = async (params: {
  email: string;
  firstName?: string;
  lastName?: string;
  tagId?: number;
  fields?: { fieldId: number; value: string }[];
}) => {
  try {
    const contactId = await acUpsertContact({
      email: params.email,
      firstName: params.firstName,
      lastName: params.lastName,
    });

    if (!contactId) return;

    await acAddToList(contactId);

    if (params.tagId) {
      await acApplyTag(contactId, params.tagId);
    }

    if (params.fields?.length) {
      await Promise.all(
        params.fields.map(f => acSetField(contactId, f.fieldId, f.value))
      );
    }
  } catch (err) {
    console.error('ActiveCampaign acTrackEvent error:', err);
  }
};
