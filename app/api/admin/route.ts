import { NextRequest, NextResponse } from "next/server";
import {
  createAdminSessionCookie,
  clearAdminSessionCookie,
  verifyAdminPassword,
  isAdminAuthenticated,
} from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, password, type, id, status } = body;

    if (action === "login") {
      if (!verifyAdminPassword(password)) {
        return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
      }
      const response = NextResponse.json({ success: true });
      response.cookies.set(createAdminSessionCookie());
      return response;
    }

    if (action === "logout") {
      const response = NextResponse.json({ success: true });
      response.cookies.set(clearAdminSessionCookie());
      return response;
    }

    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const prisma = await getPrisma();

    if (action === "delete") {
      if (type === "quote" && id) {
        await prisma.quoteRequest.delete({ where: { id } });
        return NextResponse.json({ success: true });
      }
      if (type === "contact" && id) {
        await prisma.contactMessage.delete({ where: { id } });
        return NextResponse.json({ success: true });
      }
      if (type === "pro" && id) {
        await prisma.proRequest.delete({ where: { id } });
        return NextResponse.json({ success: true });
      }
      if (type === "review" && id) {
        await prisma.review.delete({ where: { id } });
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: "Type ou id manquant" }, { status: 400 });
    }

    if (action === "update-status") {
      if (type === "quote" && id && status) {
        await prisma.quoteRequest.update({
          where: { id },
          data: { status },
        });
        return NextResponse.json({ success: true });
      }
      if (type === "contact" && id && status) {
        await prisma.contactMessage.update({
          where: { id },
          data: { status },
        });
        return NextResponse.json({ success: true });
      }
      if (type === "pro" && id && status) {
        await prisma.proRequest.update({
          where: { id },
          data: { status },
        });
        return NextResponse.json({ success: true });
      }
      if (type === "review" && id && status) {
        await prisma.review.update({
          where: { id },
          data: { status },
        });
        return NextResponse.json({ success: true });
      }
    }

    if (action === "stats") {
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay() + 1);
      startOfWeek.setHours(0, 0, 0, 0);

      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const [quotesWeek, quotesMonth, contactsWeek, contactsMonth, proWeek, proMonth, pendingReviews, betaSignupsNew] =
        await Promise.all([
          prisma.quoteRequest.count({ where: { createdAt: { gte: startOfWeek } } }),
          prisma.quoteRequest.count({ where: { createdAt: { gte: startOfMonth } } }),
          prisma.contactMessage.count({ where: { createdAt: { gte: startOfWeek } } }),
          prisma.contactMessage.count({ where: { createdAt: { gte: startOfMonth } } }),
          prisma.proRequest.count({ where: { createdAt: { gte: startOfWeek } } }),
          prisma.proRequest.count({ where: { createdAt: { gte: startOfMonth } } }),
          prisma.review.count({ where: { status: "pending" } }),
          prisma.suiteBetaSignup.count({ where: { status: "new" } }),
        ]);

      return NextResponse.json({
        quotesWeek,
        quotesMonth,
        contactsWeek,
        contactsMonth,
        proWeek,
        proMonth,
        pendingReviews,
        betaSignupsNew,
      });
    }

    return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
  } catch (error) {
    console.error("[API Admin]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const prisma = await getPrisma();
    const [quotes, contacts, proRequests, reviews] = await Promise.all([
      prisma.quoteRequest.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.proRequest.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.review.findMany({ orderBy: { createdAt: "desc" } }),
    ]);

    return NextResponse.json({ quotes, contacts, proRequests, reviews });
  } catch (error) {
    console.error("[API Admin GET]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
